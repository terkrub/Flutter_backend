const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
}, {timestamps: false})

const User = mongooose.model('users', userSchema);

module.exports = User;