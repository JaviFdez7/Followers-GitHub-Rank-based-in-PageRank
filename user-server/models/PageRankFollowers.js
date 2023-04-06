import mongoose from "mongoose";

const pageRankFollowersSchema = new mongoose.Schema({
    computationId: { type: String, required: true, unique: true },
    status: String,
    params:  { type: 
        {
            username: String,
            dampingfactor: Number,
            depth: Number
        }
    , required: true },
    result: [{ username: String, score: Number }]
});

export default mongoose.model("PageRankFollowers", pageRankFollowersSchema);
