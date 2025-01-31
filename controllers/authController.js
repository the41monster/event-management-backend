const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const secretKey = process.env.SECRET_KEY;

const register = async (req, res) => {
    const {username, email, password, role} = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({username, email, password: hashedPassword, role});
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
};

const login = async (req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if (!user) {
        console.log('User not found');
        return res.status(401).json({message: 'Invalid email or password'});
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
        console.log('Invalid password');
        return res.status(401).json({message: 'Invalid email or password'});
    }

    const token = jwt.sign({id: user._id, email: user.email, role: user.role}, secretKey, {expiresIn: '1h'});
    res.status(200).json({message: 'Login successful', token});
};

module.exports = { register, login };