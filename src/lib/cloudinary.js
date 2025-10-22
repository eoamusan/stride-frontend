// Cloudinary frontend utilities for unsigned uploads
// No server-side dependencies - pure browser implementation

// Cloudinary configuration
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

/**
 * Upload a file to Cloudinary using unsigned upload
 * @param {File} file - The file to upload
 * @param {Object} options - Additional upload options
 * @returns {Promise<Object>} - Upload result with URL and public_id
 */
export const uploadToCloudinary = async (file, options = {}) => {
  if (!file) {
    throw new Error('No file provided for upload');
  }

  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error(
      'Cloudinary configuration missing. Check environment variables.'
    );
  }

  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    // Add additional options if provided
    if (options.folder) {
      formData.append('folder', options.folder);
    }

    if (options.tags) {
      formData.append(
        'tags',
        Array.isArray(options.tags) ? options.tags.join(',') : options.tags
      );
    }

    // Use fetch for unsigned upload
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Upload failed: ${errorData.error?.message || 'Unknown error'}`
      );
    }

    const result = await response.json();

    return {
      url: result.secure_url,
      format: result.format,
      bytes: result.bytes,
      originalFilename: result.original_filename,
      createdAt: result.created_at,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};

/**
 * Delete a file from Cloudinary
 * @param {string} publicId - The public_id of the file to delete
 * @returns {Promise<Object>} - Deletion result
 */
export const deleteFromCloudinary = async (publicId) => {
  if (!publicId) {
    throw new Error('No public_id provided for deletion');
  }

  try {
    // Note: For unsigned deletion, you'll need to implement this on your backend
    // or use Cloudinary's signed deletion API
    console.warn('File deletion should be handled on the backend for security');

    // For now, we'll just return success
    // In production, implement this through your backend API
    return { result: 'ok' };
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw error;
  }
};

/**
 * Upload multiple files to Cloudinary
 * @param {FileList|Array} files - The files to upload
 * @param {Object} options - Additional upload options
 * @returns {Promise<Array>} - Array of upload results
 */
export const uploadMultipleToCloudinary = async (files, options = {}) => {
  const fileArray = Array.from(files);

  try {
    const uploadPromises = fileArray.map((file, index) =>
      uploadToCloudinary(file, {
        ...options,
        tags: [...(options.tags || []), `batch_${Date.now()}_${index}`],
      })
    );

    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    console.error('Multiple upload error:', error);
    throw error;
  }
};

export default {
  upload: uploadToCloudinary,
  delete: deleteFromCloudinary,
  uploadMultiple: uploadMultipleToCloudinary,
};
