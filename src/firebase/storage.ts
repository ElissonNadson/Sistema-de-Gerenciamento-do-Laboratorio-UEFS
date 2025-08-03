import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './config';

/**
 * Firebase Storage utilities for file management
 * 
 * IMPORTANT: Firebase Storage Free Tier (Spark Plan) Limitations:
 * - 1GB total storage capacity
 * - 10GB/month transfer bandwidth
 * - 50,000 operations per day
 * 
 * These limits are sufficient for basic file storage needs without requiring
 * a billing plan upgrade. Monitor usage in Firebase Console.
 */

export interface StorageFile {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  uploadedAt: Date;
}

/**
 * Upload a file to Firebase Storage
 * @param file - The file to upload
 * @param path - Storage path (e.g., 'documents/filename.pdf')
 * @returns Promise with download URL
 */
export async function uploadFile(file: File, path: string): Promise<string> {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('Falha ao fazer upload do arquivo');
  }
}

/**
 * Delete a file from Firebase Storage
 * @param path - Storage path of the file to delete
 */
export async function deleteFile(path: string): Promise<void> {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting file:', error);
    throw new Error('Falha ao deletar arquivo');
  }
}

/**
 * Get download URL for a file
 * @param path - Storage path of the file
 * @returns Download URL
 */
export async function getFileURL(path: string): Promise<string> {
  try {
    const storageRef = ref(storage, path);
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error('Error getting file URL:', error);
    throw new Error('Falha ao obter URL do arquivo');
  }
}

/**
 * Check if file size is within reasonable limits for free tier
 * @param file - File to check
 * @returns boolean indicating if file is acceptable
 */
export function isFileSizeAcceptable(file: File): boolean {
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB per file
  return file.size <= MAX_FILE_SIZE;
}

/**
 * Generate a unique file path
 * @param fileName - Original file name
 * @param folder - Storage folder (optional)
 * @returns Unique storage path
 */
export function generateFilePath(fileName: string, folder: string = 'uploads'): string {
  const timestamp = Date.now();
  const cleanFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  return `${folder}/${timestamp}_${cleanFileName}`;
}