import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: String,
    status: String,
    bio: String,
    avatarUrl: String,
    followers: [String],
    following: [String],
    issues: [{
            title: String,
            state: String,
            createdAt: String,
        }],
    followersRank: [{depth: Number, dampingfactor: Number, date: Date, score: Number}]
});

export default mongoose.model("User", userSchema);
