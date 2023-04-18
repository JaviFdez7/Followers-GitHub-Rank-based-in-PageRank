import mongoose from "mongoose";

const pageRankFollowersSchema = new mongoose.Schema({
    computationId: { type: String, required: true, unique: true },
    status: { type: String, default: "IN_PROGRESS" },
    params:  { type: 
        {
            username: String,
            dampingfactor: Number,
            depth: Number
        }
    , required: true },
    result: [{ username: String, score: Number }]
});

pageRankFollowersSchema.index({ computationId: 1 }, { unique: true });

export default mongoose.model("PageRankFollowers", pageRankFollowersSchema);
