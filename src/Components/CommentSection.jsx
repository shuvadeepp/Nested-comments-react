import React, { useState, useEffect } from "react";
import axios from "axios";
import CommentItem from "./CommentItem"; 
 
const API_URL = "http://localhost:5000/comments";

export default function CommentSection() {

    const [newComment, setNewComment]   = useState();
    const [comments, setComments]       = useState([]); 
    const log                           = console.log;

    useEffect(()=>{
        fetchComments();
    },[]);

    const fetchComments = async () => {
        const response = await axios.get(API_URL);
        // console.log(response);
        setComments(response.data);
    }

    const addComment = async () => {
        // console.log(newComment);
        if(!newComment.trim()) return;
        const newEntry = {
            id: Date.now().toString(),
            text: newComment,
            likes: 0,
            dislikes: 0,
            replies: [], 
        }
        await axios.post(API_URL, newEntry);
        fetchComments();
        setNewComment("");
    }


    const handleLike = async (id) => {  
        const parentLikes = comments.find((c) => findReplyById(c, id));
        const targetLike = findReplyById(parentLikes, id);
        targetLike.likes += 1;
    
        await axios.patch(`${API_URL}/${parentLikes.id}`, parentLikes); 
        fetchComments();
    }

    const handleDislike = async (id) => {
        // alert("dislike in-progress");
        const parentDisLikes = comments.find((c) => findReplyById(c, id));
        const targetDisLike = findReplyById(parentDisLikes, id);
        targetDisLike.dislikes += 1;
    
        await axios.patch(`${API_URL}/${parentDisLikes.id}`, parentDisLikes); 
        fetchComments();
    }

    const addReply = async (parentId, replyText) => {
        const parentComment = comments.find((c) => findReplyById(c, parentId));
        
        const parentReply = findReplyById(parentComment, parentId);
        
        const newReply = { 
            id: Date.now(), 
            text: replyText, 
            likes: 0, 
            dislikes: 0, 
            replies: [] 
        };
        parentReply.replies.push(newReply);
        // console.log(parentReply); return false;
        await axios.patch(`${API_URL}/${parentComment.id}`, { replies: parentComment.replies }); 
        fetchComments();
    };
    const findReplyById = (comment, replyId) => {
        if (comment.id === replyId) return comment;  
    
        for (let reply of comment.replies) {
            const found = findReplyById(reply, replyId);
            if (found) return found;  
        }
        return null;  
    };

    return(
        <>
            <h3>Facebook Comments System</h3> 
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <input 
                className="form-control" 
                type="text" 
                value={newComment} 
                onChange={(e)=>setNewComment(e.target.value)} 
                placeholder="Add a comment" 
            />
            <button 
                className="btn btn-dark btn-sm" 
                onClick={() => {
                    if (!newComment) {
                        alert("Comment cannot be empty!");
                        return;
                    }
                    addComment();
                }}
            > 
            Comment 
            </button>
            </div> 
            {
                comments.map((comment)=>( 
                    <CommentItem 
                        key={comment.id} 
                        comment={comment} 
                        handleLike={handleLike} 
                        handleDislike={handleDislike} 
                        addReply={addReply} 
                    />
                ))
            }
        </>
    );
}