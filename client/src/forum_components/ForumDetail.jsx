// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { Typography, Paper, Divider, Box } from '@mui/material';
// import http from '../http';
// import ReplyForm from './ReplyForm';

// const ForumDetail = () => {
//   const { forumId } = useParams();
//   const [forum, setForum] = useState(null);

//   useEffect(() => {
//     const fetchForum = async () => {
//       try {
//         const response = await http.get(`/api/forums/${forumId}`);
//         setForum(response.data);
//       } catch (error) {
//         console.error('Error fetching forum:', error);
//       }
//     };

//     fetchForum();
//   }, [forumId]);

//   if (!forum) {
//     return <Typography>Loading...</Typography>;
//   }

//   return (
//     <div>
//       <Typography variant="h4" gutterBottom>{forum.title}</Typography>
//       <Paper elevation={3} sx={{ padding: 2 }}>
//         <Typography variant="h6">{forum.Threads[0].RootMessage.Content}</Typography>
//         <Typography variant="subtitle2">{`By ${forum.username} | Upvotes: ${forum.NumberOfUpvotes}`}</Typography>
//       </Paper>
//       <Divider sx={{ my: 2 }} />
//       <Typography variant="h5">Replies</Typography>
//       <Box sx={{ maxHeight: 400, overflowY: 'scroll', mt: 2 }}>
//         {forum.Threads[0].Replies.map((reply) => (
//           <Paper key={reply.id} elevation={1} sx={{ padding: 2, mb: 2 }}>
//             <Typography variant="body1">{reply.RootMessage.Content}</Typography>
//             <Typography variant="subtitle2">{`By ${reply.RootMessage.User.username}`}</Typography>
//           </Paper>
//         ))}
//       </Box>
//       <ReplyForm parentId={forum.Threads[0].id} />
//     </div>
//   );
// };

// export default ForumDetail;


import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Paper, Divider, Box, Button, IconButton } from '@mui/material';
import { ThumbUp, ThumbDown } from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import http from '../http';
import ReplyForm from './ReplyForm';

const ForumDetail = () => {
  const { forumId } = useParams();
  const [forum, setForum] = useState(null);
  const [showReplyForm, setShowReplyForm] = useState({});

  useEffect(() => {
    const fetchForum = async () => {
      try {
        const response = await http.get(`/api/forums/${forumId}`);
        console.log('Fetched forum data:', response.data);
        setForum(response.data);
      } catch (error) {
        console.error('Error fetching forum:', error);
      }
    };
  
    fetchForum();
  }, [forumId]);

  const handleVote = async (type, messageId) => {
    try {
      await http.put(`/api/messages/${messageId}/vote`, { voteType: type });
      // Optimistically update the UI
      setForum((prevState) => {
        const updatedThreads = updateVoteInThreads(prevState.Threads, messageId, type);
        return { ...prevState, Threads: updatedThreads };
      });
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const updateVoteInThreads = (threads, messageId, type) => {
    return threads.map(thread => {
      if (thread.RootMessage.id === messageId) {
        if (type === 'upvote') {
          thread.RootMessage.NumberOfUpvotes += 1;
        } else {
          thread.RootMessage.NumberOfDownvotes += 1;
        }
      } else if (thread.Replies && thread.Replies.length > 0) {
        thread.Replies = updateVoteInThreads(thread.Replies, messageId, type);
      }
      return thread;
    });
  };

  const toggleReplyForm = (threadId) => {
    setShowReplyForm((prevState) => ({
      ...prevState,
      [threadId]: !prevState[threadId],
    }));
  };

  const addReply = (newReply) => {
    console.log('Adding new reply:', newReply);
    setForum((prevState) => {
      const updatedThreads = addReplyToThreads(prevState.Threads, newReply);
      console.log('Updated threads:', updatedThreads);
      return { ...prevState, Threads: updatedThreads };
    });
  };
  
  const addReplyToThreads = (threads, newReply) => {
    return threads.map(thread => {
      if (thread.id === newReply.parentThreadId) {
        return {
          ...thread,
          Replies: [...(thread.Replies || []), newReply]
        };
      } else if (thread.Replies && thread.Replies.length > 0) {
        return {
          ...thread,
          Replies: addReplyToThreads(thread.Replies, newReply)
        };
      }
      return thread;
    });
  };
  const renderReplies = (replies) => {
    return (
      <div>
        {replies.map((reply) => (
          <div key={reply.id}>
            <Paper elevation={1} sx={{ padding: 2, mb: 2, ml: 4 }}>
              <Typography variant="body1">{reply.RootMessage.Content}</Typography>
              <Typography variant="subtitle2">
                {`By ${reply.RootMessage.username} | Upvotes: ${reply.RootMessage.NumberOfUpvotes || 0} | Downvotes: ${reply.RootMessage.NumberOfDownvotes || 0} | Posted ${formatDistanceToNow(new Date(reply.RootMessage.PostedTime))} ago`}
              </Typography>
              <Box sx={{ mt: 1 }}>
                <IconButton onClick={() => handleVote('upvote', reply.RootMessage.id)} color="primary">
                  <ThumbUp />
                </IconButton>
                <IconButton onClick={() => handleVote('downvote', reply.RootMessage.id)} color="secondary">
                  <ThumbDown />
                </IconButton>
                <Button onClick={() => toggleReplyForm(reply.id)} sx={{ ml: 2 }}>
                  {showReplyForm[reply.id] ? 'Cancel Reply' : 'Reply'}
                </Button>
              </Box>
              {showReplyForm[reply.id] && (
                <ReplyForm parentId={reply.id} onReply={addReply} />
              )}
            </Paper>
            
            {/* Render nested replies recursively */}
            {reply.Replies && reply.Replies.length > 0 && (
              <div>
                {renderReplies(reply.Replies)}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };
  
  if (!forum) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <div>
      <Typography variant="h4" gutterBottom>{forum.title}</Typography>
      <Paper elevation={3} sx={{ padding: 2 }}>
        <Typography variant="h6">{forum.Threads[0].RootMessage.Content}</Typography>
        <Typography variant="subtitle2">
          {`By ${forum.Threads[0].RootMessage.username} | Upvotes: ${forum.Threads[0].RootMessage.NumberOfUpvotes} | Downvotes: ${forum.Threads[0].RootMessage.NumberOfDownvotes} | Posted ${formatDistanceToNow(new Date(forum.Threads[0].RootMessage.PostedTime))} ago`}
        </Typography>
        <Box sx={{ mt: 1 }}>
          <IconButton onClick={() => handleVote('upvote', forum.Threads[0].RootMessage.id)} color="primary">
            <ThumbUp />
          </IconButton>
          <IconButton onClick={() => handleVote('downvote', forum.Threads[0].RootMessage.id)} color="secondary">
            <ThumbDown />
          </IconButton>
          <Button onClick={() => toggleReplyForm(forum.Threads[0].id)} sx={{ ml: 2 }}>
            {showReplyForm[forum.Threads[0].id] ? 'Cancel Reply' : 'Reply'}
          </Button>
        </Box>
      </Paper>
      {showReplyForm[forum.Threads[0].id] && (
        <ReplyForm parentId={forum.Threads[0].id} onReply={addReply} />
      )}
      <Divider sx={{ my: 2 }} />
      <Typography variant="h5">Replies</Typography>
      <Box sx={{ maxHeight: 400, overflowY: 'scroll', mt: 2 }}>
        {renderReplies(forum.Threads[0].Replies)}
      </Box>
    </div>
  );
};

export default ForumDetail;


