# Storage API

## File Operations

### Upload File

- **Service**: Storage
- **Method**: `createFile`
- **Description**: Uploads a file to storage
- **Parameters**:
  - `bucketId`: Storage bucket ID
  - `fileId`: Unique ID for the file (optional)
  - `file`: File to upload
  - `permissions`: Access permissions (optional)

### Get File View

- **Service**: Storage
- **Method**: `getFileView`
- **Description**: Gets a URL to view a file
- **Parameters**:
  - `bucketId`: Storage bucket ID
  - `fileId`: File ID

### Delete File

- **Service**: Storage
- **Method**: `deleteFile`
- **Description**: Deletes a file from storage
- **Parameters**:
  - `bucketId`: Storage bucket ID
  - `fileId`: File ID

## Environment Variables

The following environment variables are used to configure the API:

```
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your-project-id
NEXT_PUBLIC_APPWRITE_DATABASE_ID=your-database-id
NEXT_PUBLIC_APPWRITE_STORAGE_ID=your-storage-id
NEXT_PUBLIC_APPWRITE_USER_COLLECTION_ID=your-user-collection-id
NEXT_PUBLIC_APPWRITE_BRAND_COLLECTION_ID=your-brand-collection-id
NEXT_PUBLIC_APPWRITE_PRODUCT_COLLECTION_ID=your-product-collection-id
```

## Client Configuration

The Appwrite client is configured in `/lib/appwrite-config.ts` with the environment variables.

## Error Handling

API errors are handled using try-catch blocks. Common error codes include:

- 401: Unauthorized
- 404: Document not found
- 409: Document already exists

## References

- [Appwrite Documentation](https://appwrite.io/docs)
- [Appwrite SDK for Web](https://appwrite.io/docs/sdks/web)