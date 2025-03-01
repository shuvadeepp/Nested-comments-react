import React, { useState } from "react";


export default function CommentItem({comment, handleLike, handleDislike, addReply, depth=0}) {
    const [replyText, setReplyText] = useState("");
    const MAX_DEPTH = 3;
    // console.log("addReply :::::: ", addReply);
    
    const canReply = depth < MAX_DEPTH;   
    return(
        <div style={{ margin: "20px", border: "1px solid black", padding: "10px", borderRadius: "10px" }}>

            <span >Reply: <b>{comment.text}</b></span>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {
                canReply && (
                    <input 
                        className="form-control" 
                        type="text" 
                        value={replyText} 
                        onChange={(e)=>setReplyText(e.target.value)} 
                        placeholder="Reply..." 
                        style={{ flex: "1" }}
                    />
                )
            }
            

            <button 
                class="btn btn-success btn-sm"
                onClick={() => handleLike(comment.id)}
            > 👍 {comment.likes}</button>
            <button 
                class="btn btn-danger btn-sm"
                onClick=""
            > 👎 </button>
            {
                canReply && (
                    <button 
                        class="btn btn-dark btn-sm" 
                        onClick={() => { 
                            if (!replyText.trim()) {   
                                alert("Reply cannot be empty!");
                                return;
                            }
                            addReply(comment.id, replyText);
                            setReplyText(""); 
                        }}
                    >Reply</button>
                )
            }
            
        </div>
            {comment.replies?.map((reply) => (
                <CommentItem 
                key={reply.id} 
                comment={reply} 
                handleLike={handleLike} 
                addReply={addReply}
                depth={depth + 1}
            />
            ))}
        </div>
    );
}