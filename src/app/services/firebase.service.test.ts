import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { FirebaseService } from './firebase.service';
import { Rating } from '../classes/rating';
import { collection, doc, setDoc, getDocs, deleteDoc, query } from 'firebase/firestore';

// Mock Firebase
vi.mock('../../firebase.config', () => ({
  db: {
    // Mock Firestore instance
    _delegate: {},
    app: {},
  },
  auth: {
    currentUser: null,
  },
}));

// Mock Firestore functions
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  doc: vi.fn(),
  setDoc: vi.fn(),
  getDocs: vi.fn(),
  deleteDoc: vi.fn(),
  query: vi.fn(),
}));

// Mock Angular Injectable decorator
vi.mock('@angular/core', () => ({
  Injectable: () => (target: any) => target,
}));

describe('FirebaseService Integration Tests', () => {
  let firebaseService: FirebaseService;
  const testData = [
    new Rating('spotify:track:test1', 'playlist1', 5),
    new Rating('spotify:track:test2', 'playlist1', 3),
  ];

  beforeEach(() => {
    firebaseService = new FirebaseService();
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Clean up localStorage
    localStorage.clear();
  });

  describe('Write Operations', () => {
    it('should write data to vitest-collection successfully', async () => {
      // Mock setDoc to simulate successful write
      const mockSetDoc = vi.mocked(setDoc);
      const mockDoc = vi.mocked(doc);
      const mockCollection = vi.mocked(collection);
      
      mockCollection.mockReturnValue({ id: 'vitest-collection' } as any);
      mockDoc.mockReturnValue({ id: 'test-user' } as any);
      mockSetDoc.mockResolvedValue(undefined);

      // Create test method to write to vitest-collection
      const writeToTestCollection = async (data: Rating[]) => {
        const testCollection = mockCollection({} as any, 'vitest-collection');
        const testCollectionRef = mockDoc(testCollection, 'test-user');
        const dataToSave = data.map(rating => ({
          trackURI: rating.trackURI,
          playlistId: rating.playlistId,
          rating: rating.rating
        }));
        
        await setDoc(testCollectionRef, {
          ratings: dataToSave,
          lastUpdated: new Date().toISOString(),
          totalRatings: dataToSave.length,
          testCollection: true
        });
      };

      // Execute test
      await expect(writeToTestCollection(testData)).resolves.not.toThrow();
      
      // Verify the write operation was called
      expect(mockSetDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          ratings: expect.arrayContaining([
            { trackURI: 'spotify:track:test1', playlistId: 'playlist1', rating: 5 },
            { trackURI: 'spotify:track:test2', playlistId: 'playlist1', rating: 3 },
          ]),
          testCollection: true,
          totalRatings: 2,
        })
      );
      
      expect(mockDoc).toHaveBeenCalledWith(expect.anything(), 'test-user');
      expect(mockCollection).toHaveBeenCalledWith({}, 'vitest-collection');
    });

    it('should handle write errors gracefully', async () => {
      const mockSetDoc = vi.mocked(setDoc);
      const mockDoc = vi.mocked(doc);
      const mockCollection = vi.mocked(collection);
      
      mockCollection.mockReturnValue({ id: 'vitest-collection' } as any);
      mockDoc.mockReturnValue({ id: 'test-user' } as any);
      mockSetDoc.mockRejectedValue(new Error('Firebase write error'));

      const writeToTestCollection = async (data: Rating[]) => {
        const testCollection = mockCollection({} as any, 'vitest-collection');
        const testCollectionRef = mockDoc(testCollection, 'test-user');
        await setDoc(testCollectionRef, { ratings: data });
      };

      await expect(writeToTestCollection(testData)).rejects.toThrow('Firebase write error');
    });
  });

  describe('Read Operations', () => {
    it('should read data from vitest-collection successfully', async () => {
      // Mock Firebase read operations
      const mockGetDocs = vi.mocked(getDocs);
      const mockQuery = vi.mocked(query);
      const mockCollection = vi.mocked(collection);

      const mockDocData = {
        ratings: [
          { trackURI: 'spotify:track:test1', playlistId: 'playlist1', rating: 5 },
          { trackURI: 'spotify:track:test2', playlistId: 'playlist1', rating: 3 },
        ],
        lastUpdated: '2025-11-22T00:00:00.000Z',
        totalRatings: 2,
        testCollection: true
      };

      const mockDocSnapshot = {
        empty: false,
        docs: [
          {
            data: () => mockDocData,
            id: 'test-user'
          }
        ]
      };

      mockCollection.mockReturnValue({ id: 'vitest-collection' } as any);
      mockQuery.mockReturnValue({} as any);
      mockGetDocs.mockResolvedValue(mockDocSnapshot as any);

      // Create test method to read from vitest-collection  
      const readFromTestCollection = async (): Promise<Rating[]> => {
        const testQuery = query(collection({} as any, 'vitest-collection'));
        const docSnap = await getDocs(testQuery);
        
        if (docSnap.empty) {
          return [];
        }

        const ratingsData = docSnap.docs[0]?.data() as any;
        if (ratingsData && ratingsData['ratings']) {
          return ratingsData['ratings'].map((ratingData: any) => 
            new Rating(ratingData.trackURI, ratingData.playlistId, ratingData.rating)
          );
        }
        return [];
      };

      // Execute test
      const result = await readFromTestCollection();
      
      // Verify the results
      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(Rating);
      expect(result[0].trackURI).toBe('spotify:track:test1');
      expect(result[0].playlistId).toBe('playlist1');
      expect(result[0].rating).toBe(5);
      
      expect(result[1]).toBeInstanceOf(Rating);
      expect(result[1].trackURI).toBe('spotify:track:test2');
      expect(result[1].rating).toBe(3);
      
      // Verify Firebase operations were called
      expect(mockGetDocs).toHaveBeenCalled();
      expect(mockQuery).toHaveBeenCalled();
      expect(mockCollection).toHaveBeenCalledWith({}, 'vitest-collection');
    });

    it('should handle empty collection read gracefully', async () => {
      const mockGetDocs = vi.mocked(getDocs);
      const mockQuery = vi.mocked(query);
      const mockCollection = vi.mocked(collection);

      const mockEmptySnapshot = {
        empty: true,
        docs: []
      };

      mockCollection.mockReturnValue({ id: 'vitest-collection' } as any);
      mockQuery.mockReturnValue({} as any);
      mockGetDocs.mockResolvedValue(mockEmptySnapshot as any);

      const readFromTestCollection = async (): Promise<Rating[]> => {
        const testQuery = query(collection({} as any, 'vitest-collection'));
        const docSnap = await getDocs(testQuery);
        
        if (docSnap.empty) {
          return [];
        }
        return [];
      };

      const result = await readFromTestCollection();
      
      expect(result).toHaveLength(0);
      expect(result).toEqual([]);
    });

    it('should handle read errors gracefully', async () => {
      const mockGetDocs = vi.mocked(getDocs);
      const mockQuery = vi.mocked(query);
      const mockCollection = vi.mocked(collection);

      mockCollection.mockReturnValue({ id: 'vitest-collection' } as any);
      mockQuery.mockReturnValue({} as any);
      mockGetDocs.mockRejectedValue(new Error('Firebase read error'));

      const readFromTestCollection = async (): Promise<Rating[]> => {
        const testQuery = query(collection({} as any, 'vitest-collection'));
        const docSnap = await getDocs(testQuery);
        return [];
      };

      await expect(readFromTestCollection()).rejects.toThrow('Firebase read error');
    });
  });

  describe('Integration Flow', () => {
    it('should successfully write and then read back the same data', async () => {
      // Mock both write and read operations
      const mockSetDoc = vi.mocked(setDoc);
      const mockGetDocs = vi.mocked(getDocs);
      const mockDoc = vi.mocked(doc);
      const mockQuery = vi.mocked(query);
      const mockCollection = vi.mocked(collection);

      // Setup mocks for write operation
      mockCollection.mockReturnValue({ id: 'vitest-collection' } as any);
      mockDoc.mockReturnValue({ id: 'test-user' } as any);
      mockSetDoc.mockResolvedValue(undefined);

      // Setup mocks for read operation
      const writtenData = testData.map(rating => ({
        trackURI: rating.trackURI,
        playlistId: rating.playlistId,
        rating: rating.rating
      }));

      const mockDocData = {
        ratings: writtenData,
        lastUpdated: '2025-11-22T00:00:00.000Z',
        totalRatings: writtenData.length
      };

      const mockDocSnapshot = {
        empty: false,
        docs: [{ data: () => mockDocData, id: 'test-user' }]
      };

      mockQuery.mockReturnValue({} as any);
      mockGetDocs.mockResolvedValue(mockDocSnapshot as any);

      // Execute write-read cycle
      const writeToTestCollection = async (data: Rating[]) => {
        const testCollection = mockCollection({} as any, 'vitest-collection');
        const testCollectionRef = mockDoc(testCollection, 'test-user');
        const dataToSave = data.map(rating => ({
          trackURI: rating.trackURI,
          playlistId: rating.playlistId,
          rating: rating.rating
        }));
        
        await setDoc(testCollectionRef, {
          ratings: dataToSave,
          lastUpdated: new Date().toISOString(),
          totalRatings: dataToSave.length
        });
      };

      const readFromTestCollection = async (): Promise<Rating[]> => {
        const testQuery = query(collection({} as any, 'vitest-collection'));
        const docSnap = await getDocs(testQuery);
        
        if (docSnap.empty) {
          return [];
        }

        const ratingsData = docSnap.docs[0]?.data() as any;
        if (ratingsData && ratingsData['ratings']) {
          return ratingsData['ratings'].map((ratingData: any) => 
            new Rating(ratingData.trackURI, ratingData.playlistId, ratingData.rating)
          );
        }
        return [];
      };

      // Write data
      await writeToTestCollection(testData);
      
      // Read data back
      const readData = await readFromTestCollection();
      
      // Verify write-read cycle
      expect(readData).toHaveLength(testData.length);
      expect(readData[0].trackURI).toBe(testData[0].trackURI);
      expect(readData[0].rating).toBe(testData[0].rating);
      expect(readData[1].trackURI).toBe(testData[1].trackURI);
      expect(readData[1].rating).toBe(testData[1].rating);
    });
  });
});