import { Injectable } from '@angular/core';
import { db, auth } from '../../firebase.config';
import { collection, addDoc, getDocs, query, where, deleteDoc, doc, updateDoc, setDoc } from 'firebase/firestore';
import { Rating } from '../classes/rating';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor() { }

  /**
   * Load ratings and save to localStorage
   * This is the main entry point for syncing data to local storage
   */
  async loadRatings(): Promise<void> {
    console.log('FirebaseService - Loading ratings from database');
    try {
      const ratings = await this.getRatings();
      console.log(`FirebaseService - Loaded ${ratings.length} ratings`);
      // Save to localStorage for other components to use
      localStorage.setItem('ratings', JSON.stringify(ratings));
      console.log('FirebaseService - Saved ratings to localStorage for other components');
    } catch (error) {
      console.log('FirebaseService - Load failed, keeping existing localStorage:', error);
      // Keep existing localStorage data if fails
      const existingRatings = localStorage.getItem('ratings');
      if (!existingRatings) {
        console.log('FirebaseService - No existing localStorage, initializing empty ratings');
        localStorage.setItem('ratings', JSON.stringify([]));
      }
    }
  }

  /**
   * Save ratings array to database
   * @param ratings Array of Rating objects to save
   * @returns Promise that resolves when save is complete
   */
  async saveRatings(ratings: Rating[]): Promise<void> {
    console.log('FirebaseService - Saving ratings', ratings);
    try {
      // Use a test collection for unauthenticated access
      // When user auth is added, change to: users/${user.uid}/ratings
      const userRatingsRef = doc(db, 'test-ratings', 'local-user');
      
      // Convert Rating instances to plain objects for Firestore
      const ratingsData = ratings.map(rating => ({
        trackURI: rating.trackURI,
        playlistId: rating.playlistId,
        rating: rating.rating
      }));
      
      // Save the entire ratings array as a document
      await setDoc(userRatingsRef, {
        ratings: ratingsData,
        lastUpdated: new Date().toISOString(),
        totalRatings: ratingsData.length
      });
      
      console.log(`Successfully saved ${ratingsData.length} ratings`);
      return;
    } catch (error) {
      console.error('Error saving ratings:', error);
      throw error;
    }
  }

  /**
   * Load ratings from database
   * @returns Promise that resolves with array of Rating objects
   */
  async getRatings(): Promise<Rating[]> {
    try {
      // Use a test collection for unauthenticated access
      const docSnap = await getDocs(query(collection(db, 'test-ratings')));
      
      if (docSnap.empty) {
        console.log('No ratings found');
        return [];
      }

      const ratingsData = docSnap.docs[0]?.data() as any;
      if (ratingsData && ratingsData['ratings']) {
        console.log(`Loaded ${ratingsData['ratings'].length} ratings`);
        // Convert plain objects back to Rating instances
        return ratingsData['ratings'].map((ratingData: any) => 
          new Rating(ratingData.trackURI, ratingData.playlistId, ratingData.rating)
        );
      }
      return [];
    } catch (error) {
      console.error('Error loading ratings:', error);
      throw error;
    }
  }

  /**
   * Check if user is authenticated
   * @returns boolean indicating if user is logged in
   */
  isUserAuthenticated(): boolean {
    // For now, allow unauthenticated access for testing
    // When user auth is implemented, uncomment: return auth.currentUser !== null;
    return true;
  }

  /**
   * Get current user ID
   * @returns User UID or null if not authenticated
   */
  getCurrentUserId(): string | null {
    return auth.currentUser?.uid || null;
  }
}