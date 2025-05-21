# Database API

## Collections

The application uses the following collections:

1. **Users Collection**
   - Collection ID: `${NEXT_PUBLIC_APPWRITE_USER_COLLECTION_ID}`
   - Document structure as defined in `appwrite-setup.md`

2. **Brands Collection**
   - Collection ID: `${NEXT_PUBLIC_APPWRITE_BRAND_COLLECTION_ID}`
   - Document structure as defined in `appwrite-setup.md`

3. **Products Collection**
   - Collection ID: `${NEXT_PUBLIC_APPWRITE_PRODUCT_COLLECTION_ID}`
   - Document structure as defined in `appwrite-setup.md`

## Common Database Operations

### Create Document

- **Service**: Databases
- **Method**: `createDocument`
- **Description**: Creates a new document in a collection
- **Parameters**:
  - `databaseId`: Database ID
  - `collectionId`: Collection ID
  - `documentId`: Unique ID for the document (optional)
  - `data`: Document data
  - `permissions`: Access permissions (optional)

### List Documents

- **Service**: Databases
- **Method**: `listDocuments`
- **Description**: Lists documents in a collection
- **Parameters**:
  - `databaseId`: Database ID
  - `collectionId`: Collection ID
  - `queries`: Query filters (optional)

### Get Document

- **Service**: Databases
- **Method**: `getDocument`
- **Description**: Retrieves a specific document
- **Parameters**:
  - `databaseId`: Database ID
  - `collectionId`: Collection ID
  - `documentId`: Document ID

### Update Document

- **Service**: Databases
- **Method**: `updateDocument`
- **Description**: Updates an existing document
- **Parameters**:
  - `databaseId`: Database ID
  - `collectionId`: Collection ID
  - `documentId`: Document ID
  - `data`: Updated document data
  - `permissions`: Updated access permissions (optional)

### Delete Document

- **Service**: Databases
- **Method**: `deleteDocument`
- **Description**: Deletes a document
- **Parameters**:
  - `databaseId`: Database ID
  - `collectionId`: Collection ID
  - `documentId`: Document ID