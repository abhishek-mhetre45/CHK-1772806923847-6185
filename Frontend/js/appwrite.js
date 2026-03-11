// ===============================
// CraftConnect - Appwrite Config & API
// ===============================
// project_id=69aeeeef002294858f1e
// endpoint=https://fra.cloud.appwrite.io/v1
// bucket_id=69aefd740003078c6246
// database_id=69aef8400011a0aa4975
// tables: users, reviews_table, products, orders

(function (window) {
    'use strict';

    const APPWRITE = {
        endpoint: 'https://fra.cloud.appwrite.io/v1',
        projectId: '69aeeeef002294858f1e',
        databaseId: '69aef8400011a0aa4975',
        bucketId: '69aefd740003078c6246',
        collections: {
            users: 'users',
            reviews: 'reviews_table',
            products: 'products',
            orders: 'orders'
        }
    };

    let client = null;
    let databases = null;
    let storage = null;

    function getClient() {
        if (client) return client;
        if (typeof Appwrite === 'undefined') {
            console.warn('Appwrite SDK not loaded');
            return null;
        }
        const { Client, Databases, Storage } = Appwrite;
        client = new Client().setEndpoint(APPWRITE.endpoint).setProject(APPWRITE.projectId);
        databases = new Databases(client);
        storage = new Storage(client);
        return client;
    }

    function getDatabases() {
        getClient();
        return databases;
    }

    function getStorage() {
        getClient();
        return storage;
    }

    /** Get unique ID (max 36 chars for Appwrite documentId) */
    function uniqueId() {
        if (typeof Appwrite !== 'undefined' && Appwrite.ID && Appwrite.ID.unique) {
            try {
                return Appwrite.ID.unique();
            } catch (e) {}
        }
        var s = Math.random().toString(36).slice(2) + Date.now().toString(36);
        return s.length > 36 ? s.slice(0, 36) : s;
    }

    /**
     * Get image URL for a file stored in bucket (for product display).
     * Uses the Appwrite storage view endpoint so <img src="..."> can load the file.
     */
    function getImageUrl(fileId) {
        if (!fileId) return '';
        return APPWRITE.endpoint + '/storage/buckets/' + APPWRITE.bucketId + '/files/' + fileId + '/view?project=' + APPWRITE.projectId;
    }

    function buildUserPayload(data) {
        var id = uniqueId();
        var payload = {
            databaseId: APPWRITE.databaseId,
            collectionId: APPWRITE.collections.users,
            documentId: id,
            data: {
                name: String(data.name || '').trim() || 'User',
                email: String(data.email || '').trim(),
                role: String(data.role || 'customer').trim() || 'customer',
                location: String(data.location || '').trim() || '-',
                craft_type: String(data.craft_type || '').trim() || '-'
            }
        };
        if (typeof Appwrite !== 'undefined' && Appwrite.Permission && Appwrite.Role) {
            try {
                payload.permissions = [Appwrite.Permission.read(Appwrite.Role.any()), Appwrite.Permission.update(Appwrite.Role.any())];
            } catch (e) {}
        }
        if (data.profile_images) payload.data.profile_images = String(data.profile_images);
        return payload;
    }

    /**
     * Create user in users collection (uses default endpoint).
     */
    async function createUser(data) {
        const db = getDatabases();
        if (!db) throw new Error('Appwrite not loaded');
        var payload = buildUserPayload(data);
        try {
            return await db.createDocument(payload);
        } catch (e) {
            console.error('Appwrite createUser error:', e);
            throw e;
        }
    }

    /**
     * Try creating user with a specific endpoint (e.g. global fallback).
     * Use when default endpoint fails with "Failed to fetch".
     */
    async function createUserWithEndpoint(endpointUrl, data) {
        if (typeof Appwrite === 'undefined' || !Appwrite.Client || !Appwrite.Databases) throw new Error('Appwrite not loaded');
        var c = new Appwrite.Client().setEndpoint(endpointUrl).setProject(APPWRITE.projectId);
        var db = new Appwrite.Databases(c);
        var payload = buildUserPayload(data);
        return await db.createDocument(payload);
    }

    /**
     * List users (e.g. to find by email for login). Use Query.equal('email', [email]).
     */
    async function listUsersByEmail(email) {
        const db = getDatabases();
        if (!db) return { documents: [] };
        try {
            var queries = [];
            if (typeof Appwrite !== 'undefined' && Appwrite.Query && Appwrite.Query.equal) {
                queries = [Appwrite.Query.equal('email', [String(email || '')])];
            }
            const list = await db.listDocuments({
                databaseId: APPWRITE.databaseId,
                collectionId: APPWRITE.collections.users,
                queries: queries
            });
            return list;
        } catch (e) {
            console.error('Appwrite listUsersByEmail error:', e);
            return { documents: [] };
        }
    }

    /**
     * Upload a file to the bucket. Returns the file object with $id.
     */
    async function uploadFile(file) {
        const s = getStorage();
        if (!s) throw new Error('Storage not available');
        const fileId = typeof Appwrite !== 'undefined' && Appwrite.ID && Appwrite.ID.unique ? Appwrite.ID.unique() : uniqueId();
        const result = await s.createFile({
            bucketId: APPWRITE.bucketId,
            fileId: fileId,
            file: file
        });
        return result;
    }

    /** Build permissions array for "any" read if SDK supports it */
    function anyReadPermission() {
        if (typeof Appwrite !== 'undefined' && Appwrite.Permission && Appwrite.Role) {
            try {
                return [Appwrite.Permission.read(Appwrite.Role.any())];
            } catch (e) {}
        }
        return undefined;
    }

    /**
     * Create product in products collection.
     * Schema: product_name, description, price, stock, artisan_id, category, image_id, created_at
     */
    async function createProduct(data) {
        const db = getDatabases();
        if (!db) return null;
        const id = uniqueId();
        const createdAt = new Date().toISOString();
        var payload = {
            databaseId: APPWRITE.databaseId,
            collectionId: APPWRITE.collections.products,
            documentId: id,
            data: {
                product_name: String(data.product_name || ''),
                description: String(data.description || ''),
                price: Number(data.price) || 0,
                stock: Number(data.stock) || 0,
                artisan_id: String(data.artisan_id || ''),
                category: String(data.category || ''),
                image_id: String(data.image_id || ''),
                created_at: data.created_at || createdAt
            }
        };
        var perms = anyReadPermission();
        if (perms) payload.permissions = perms;
        try {
            const doc = await db.createDocument(payload);
            return doc;
        } catch (e) {
            console.error('Appwrite createProduct error:', e);
            throw e;
        }
    }

    /**
     * List all products from database.
     */
    async function listProducts() {
        const db = getDatabases();
        if (!db) return { documents: [] };
        try {
            const list = await db.listDocuments({
                databaseId: APPWRITE.databaseId,
                collectionId: APPWRITE.collections.products
            });
            return list;
        } catch (e) {
            console.error('Appwrite listProducts error:', e);
            return { documents: [] };
        }
    }

    /**
     * Create order in orders collection.
     * Schema: product_id, customer_id, artisen_id, quantity, total_price, payment_status, order_status, payment_id (optional), created_at
     */
    async function createOrder(data) {
        const db = getDatabases();
        if (!db) return null;
        const id = uniqueId();
        const createdAt = new Date().toISOString();
        var payload = {
            databaseId: APPWRITE.databaseId,
            collectionId: APPWRITE.collections.orders,
            documentId: id,
            data: {
                product_id: String(data.product_id || ''),
                customer_id: String(data.customer_id || ''),
                artisen_id: String(data.artisen_id || ''),
                quantity: Number(data.quantity) || 1,
                total_price: Number(data.total_price) || 0,
                payment_status: String(data.payment_status || 'pending'),
                order_status: String(data.order_status || 'placed'),
                payment_id: data.payment_id ? String(data.payment_id) : '',
                created_at: data.created_at || createdAt
            }
        };
        var perms = anyReadPermission();
        if (perms) payload.permissions = perms;
        try {
            const doc = await db.createDocument(payload);
            return doc;
        } catch (e) {
            console.error('Appwrite createOrder error:', e);
            throw e;
        }
    }

    /**
     * Create review in reviews_table.
     * Schema: product_id, customer_id, rating, comment (optional), created_at
     */
    async function createReview(data) {
        const db = getDatabases();
        if (!db) return null;
        const id = uniqueId();
        try {
            const doc = await db.createDocument({
                databaseId: APPWRITE.databaseId,
                collectionId: APPWRITE.collections.reviews,
                documentId: id,
                data: {
                    product_id: String(data.product_id || ''),
                    customer_id: String(data.customer_id || ''),
                    rating: Number(data.rating) || 0,
                    comment: data.comment ? String(data.comment) : ''
                }
            });
            return doc;
        } catch (e) {
            console.error('Appwrite createReview error:', e);
            throw e;
        }
    }

    window.AppwriteConfig = APPWRITE;
    window.AppwriteAPI = {
        getClient,
        getDatabases,
        getStorage,
        uniqueId,
        getImageUrl,
        createUser,
        createUserWithEndpoint,
        listUsersByEmail,
        uploadFile,
        createProduct,
        listProducts,
        createOrder,
        createReview
    };
})(window);
