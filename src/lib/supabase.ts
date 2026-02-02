import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Bucket name for thumbnails
export const THUMBNAILS_BUCKET = 'thumbnails';

/**
 * Upload an image to Supabase Storage
 * @param base64Data - Base64 encoded image data (with or without data URL prefix)
 * @param fileName - Name for the file
 * @returns Public URL of the uploaded image, or null if failed
 */
export async function uploadImageToSupabase(
  base64Data: string,
  fileName: string
): Promise<string | null> {
  try {
    // Remove data URL prefix if present
    const base64Clean = base64Data.replace(/^data:image\/\w+;base64,/, '');
    
    // Convert base64 to Uint8Array
    const binaryString = atob(base64Clean);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Generate unique file name with timestamp
    const timestamp = Date.now();
    const uniqueFileName = `${timestamp}-${fileName}.png`;

    // Upload to Supabase
    const { data, error } = await supabase.storage
      .from(THUMBNAILS_BUCKET)
      .upload(uniqueFileName, bytes, {
        contentType: 'image/png',
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Supabase upload error:', error);
      return null;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(THUMBNAILS_BUCKET)
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Error uploading to Supabase:', error);
    return null;
  }
}

/**
 * Delete an image from Supabase Storage
 * @param fileUrl - Public URL of the file to delete
 */
export async function deleteImageFromSupabase(fileUrl: string): Promise<boolean> {
  try {
    // Extract file name from URL
    const urlParts = fileUrl.split('/');
    const fileName = urlParts[urlParts.length - 1];

    const { error } = await supabase.storage
      .from(THUMBNAILS_BUCKET)
      .remove([fileName]);

    if (error) {
      console.error('Supabase delete error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting from Supabase:', error);
    return false;
  }
}
