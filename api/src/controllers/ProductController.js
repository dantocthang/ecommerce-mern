import { validationResult } from 'express-validator'
import cloudinary from 'cloudinary'
import moment from 'moment'

import Product from '../models/Product.js'
import Type from '../models/Type.js'
import { createError } from '../utils/error.js'
import Brand from '../models/Brand.js'
import Promotion from '../models/Promotion.js'
import { productCreation } from '../utils/createNotification.js'

class ProductController {
    async updatePrice(req, res, next) {
        const promotions = await Promotion.find({
            startDate: { $lte: new Date() },
            endDate: { $gte: new Date() }
        })

        for (let i = 0; i < promotions.length; i++) {
            for (let j = 0; j < promotions[i].content.length; j++) {
                const thisProduct = await Product.findById(promotions[i].content[j].productId)
                if (thisProduct.price === thisProduct.oldPrice) {
                    await Product.findByIdAndUpdate(thisProduct._id, {
                        oldPrice: thisProduct.price,
                        price: promotions[i].content[j].promotionPrice
                    })
                }
            }
        }

        const products = await Product.find()
        products.forEach(async p => {
            const promotion = await Promotion.findOne({
                content: {
                    $elemMatch: { productId: p._id }
                },
                startDate: { $lte: new Date() },
                endDate: { $gte: new Date() }
            })
            if (!promotion) {
                const product = await Product.findById(p._id)
                await Product.findByIdAndUpdate(p._id, { price: product.oldPrice })
            }
        })

        next()
    }

    // [GET] /product/grid
    async getAllGrid(req, res, next) {
        try {
            const products = res.paginatedResult
            // const calculatePromotion = await Promise.all(
            //     products.data.map(async p => {
            //         const promotion = await Promotion.findOne({
            //             content: {
            //                 $elemMatch: { productId: p._id }
            //             },
            //             startDate: { $lte: new Date() },
            //             endDate: { $gte: new Date() }
            //         })
            //         if (promotion) {
            //             const curPrice = promotion.content.find(i => i.productId == p._id)
            //             const newP = { ...p }
            //             newP._doc.oldPrice = p.price
            //             newP._doc.price = curPrice.promotionPrice
            //             console.log(newP)
            //             return newP._doc
            //         }
            //         return p._doc
            //     })
            // )

            // products.data = calculatePromotion
            res.json(products)
        } catch (error) {
            next(error)
        }
    }

    // [GET] /product/
    async getAll(req, res, next) {
        try {
            const products = await Product.find()
            res.json(products)
        } catch (error) {
            next(error)
        }
    }


    // [GET] /product/:id
    async get(req, res, next) {
        try {
            const product = await Product.findById(req.params.id)
            if (!product)
                return res.json({ success: false, message: 'Product with that id is not exist.' })
            res.json(product)
        } catch (error) {
            next(error)
        }
    }

    // [GET] /product/type
    async getAllTypes(req, res, next) {
        try {
            const types = await Type.find()
            res.json(types)
        } catch (error) {
            res.json({ success: false, message: error })
        }
    }

    // [GET] /product/brand
    async getAllBrands(req, res, next) {
        try {
            const brands = await Brand.find()
            res.json(brands)
        } catch (error) {
            res.json({ success: false, message: error })
        }
    }

    // [POST] /product/create
    async create(req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.json({ success: false, errors: errors.array() });
        }
        try {
            const { photos, stock, ...dataToFindDuplicate } = req.body
            const isDuplicate = await Product.findOne(dataToFindDuplicate)
            if (!isDuplicate) {
                const savedProduct = new Product(req.body)
                const typeAlreadyExists = await Type.findOne({ name: req.body.type })
                const brandAlreadyExists = await Brand.findOne({ name: req.body.brand })
                if (!typeAlreadyExists) {
                    const newType = new Type({ name: req.body.type })
                    await newType.save()
                }
                if (!brandAlreadyExists) {
                    const newBrand = new Brand({ name: req.body.brand })
                    await newBrand.save()
                }
                await savedProduct.save()

                productCreation(savedProduct)

                return res.json(savedProduct)
            }
            else next(createError(400, 'This product is already existed'))
        } catch (error) {
            next(error)
        }
    }

    // [PUT] /product/:id
    async update(req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.json({ errors: errors.array() });
        }
        try {
            const product = await Product.findById(req.params.id)
            if (product) {
                if (JSON.stringify(req.body.photos) !== JSON.stringify(product.photos)) {
                    product.photos.forEach(photoItem => {
                        cloudinary.v2.uploader.destroy(photoItem.public_id, function (error, result) {
                            console.log(result, error)
                        });
                    })
                }
            }
            const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body)
            res.json({ success: true, message: 'Product updated successfully' })
        } catch (error) {
            next(error)
        }
    }

    // [PATCH] /product/:id
    async updateImages(req, res, next) {
        try {
            const product = await Product.findById(req.params.id)
            if (product) {
                cloudinary.v2.uploader.destroy(req.body.public_id, function (error, result) {
                    console.log(result, error)
                });
                product.photos = product.photos.filter(item => item.public_id !== req.body.public_id)
                product.save()
                res.json({ success: true, message: "Product's image deleted successfully" })
            }
            else return res.json({ success: false, message: 'Product id not exist' })
        } catch (error) {
            next(error)
        }
    }

    // [DELETE] /product/:id
    async delete(req, res, next) {
        try {
            await Product.findByIdAndDelete(req.params.id)
            res.json({ success: true, message: 'Product deleted' })
        } catch (error) {
            next(error)
        }
    }
}

export default new ProductController()