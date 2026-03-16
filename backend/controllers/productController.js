import { asyncHandler } from '../middleware/errorMiddleware.js';
import Product from '../models/Product.js';
import axios from 'axios';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req, res) => {
    // Implementing Search, Pagination, and Filters
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;

    // Search keyword
    const keyword = req.query.keyword
        ? {
            name: {
                $regex: req.query.keyword,
                $options: 'i',
            },
        }
        : {};

    // Filters
    const categoryFilter = req.query.category ? { category: req.query.category } : {};
    const purityFilter = req.query.purity ? { purity: req.query.purity } : {};

    // Combine all filters
    const filter = { ...keyword, ...categoryFilter, ...purityFilter };

    const count = await Product.countDocuments(filter);
    const products = await Product.find(filter)
        .limit(pageSize)
        .skip(pageSize * (page - 1));

    res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        res.json(product);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = asyncHandler(async (req, res) => {
    const { name, description, category, purity, weight, makingCharges, image, stock } = req.body;

    const product = new Product({
        name: name || 'Sample name',
        description: description || 'Sample description',
        category: category || 'Rings',
        purity: purity || '22K',
        weight: weight || 10,
        makingCharges: makingCharges || 1000,
        image: image || '/images/sample.jpg',
        stock: stock || 0,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = asyncHandler(async (req, res) => {
    const {
        name,
        description,
        category,
        purity,
        weight,
        makingCharges,
        image,
        stock,
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
        product.name = name;
        product.description = description;
        product.category = category;
        product.purity = purity;
        product.weight = weight;
        product.makingCharges = makingCharges;
        product.image = image;
        product.stock = stock;

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        await product.deleteOne();
        res.json({ message: 'Product removed' });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Proxy GLB file to bypass CORS
// @route   GET /api/products/proxy-glb
// @access  Public
export const getProxyGLB = asyncHandler(async (req, res) => {
    const { url } = req.query;

    if (!url) {
        res.status(400);
        throw new Error('URL parameter is required');
    }

    try {
        const response = await axios({
            method: 'get',
            url: url,
            responseType: 'stream'
        });

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
        res.setHeader('Content-Type', 'model/gltf-binary');
        
        response.data.pipe(res);
    } catch (error) {
        console.error('Proxy Error:', error.message);
        res.status(500);
        throw new Error('Failed to fetch GLB file: ' + error.message);
    }
});
