import mongoose from 'mongoose'

const ProductSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    oldPrice: {
        type: Number,
        default: 0
    },
    havePromotion: {
        type: Boolean,
        default: false
    },
    gifts: [
        {
            giftId: {type: String},
            giftName: {type: String},
            giftPhoto: {type: String},
            giftPrice: {type: Number}
        }
    ],
    type: {
        type: String,
        required: true
    },
    modelYear: {
        type: Number,
        default: new Date().getFullYear()
    },
    photos: [
        {
            url: {
                type: String
            },
            public_id: {
                type: String
            }
        }
    ],
    isFeatured: {
        type: Boolean,
        default: false
    },
    stock: {
        type: Number,
        default: 0
    }
}, { timestamps: true })

export default mongoose.model('Product', ProductSchema)