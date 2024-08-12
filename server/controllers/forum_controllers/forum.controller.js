const db = require("../../models");
const Forum = db.Forum;
const Thread = db.Thread;
const Message = db.Message;
const User = db.Users;

/**
 * Get all forums with their root messages and metadata.
 */
exports.getAllForums = async (req, res) => {
  try {
    const forums = await Forum.findAll({
      include: {
        model: Thread,
        include: [
          {
            model: Message,
            as: "RootMessage",
            include: {
              model: User,
              attributes: ["username", "avatar_url"],
            },
          },
          {
            model: Thread,
            as: "Replies",
            include: {
              model: Message,
              as: "RootMessage",
              include: {
                model: User,
                attributes: ["username", "avatar_url"],
              },
            },
          },
        ],
      },
    });

    res.json(forums);
  } catch (error) {
    console.error("Error fetching forums:", error);
    res.status(500).json({ message: "Error fetching forums", error });
  }
};

/**
 * Create a new forum post with an initial message.
 */
exports.createForum = async (req, res) => {
  const { title, username, content } = req.body;

  try {
    // Ensure the user exists
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Create the root message
    const message = await Message.create({
      username,
      Content: content,
      PostedTime: new Date(),
    });

    // Create the forum
    const forum = await Forum.create({
      title,
      username,
    });

    // Create the thread linking to the forum and the root message
    const thread = await Thread.create({
      forumId: forum.id,
      rootMessageId: message.id,
    });

    res
      .status(201)
      .json({ message: "Forum created successfully", forum, thread });
  } catch (error) {
    console.error("Error creating forum:", error);
    res.status(400).json({ message: "Error creating forum", error });
  }
};

/**
 * Reply to a specific post in a forum.
 */
exports.replyToPost = async (req, res) => {
  const { threadId } = req.params;
  const { username, content } = req.body;

  try {
    const parentThread = await Thread.findByPk(threadId, {
      include: {
        model: Message,
        as: "RootMessage",
      },
    });

    if (!parentThread) {
      return res.status(404).json({ message: "Parent thread not found" });
    }

    // Create the reply message
    const message = await Message.create({
      username: username,
      Content: content,
      PostedTime: new Date(),
    });

    // Create the reply thread
    const replyThread = await Thread.create({
      rootMessageId: message.id,
      parentThreadId: threadId,
      forumId: parentThread.forumId,
    });

    res
      .status(201)
      .json({ message: "Reply created successfully", replyThread });
  } catch (error) {
    console.error("Error creating reply:", error);
    res.status(400).json({ message: "Error creating reply", error });
  }
};


/**
 * Reply to a specific message thread in a forum.
 */
exports.replyToThread = async (req, res) => {
    const { parentThreadId } = req.params;
    const { username, content } = req.body;
  
    try {
      // Find the parent thread by ID
      const parentThread = await Thread.findByPk(parentThreadId, {
        include: {
          model: Message,
          as: 'RootMessage',
          include: {
            model: User,
            attributes: ['username'],
          },
        },
      });
  
      if (!parentThread) {
        return res.status(404).json({ message: "Parent thread not found" });
      }
  
      // Create a new message associated with the user
      const message = await Message.create({
        username,
        Content: content,
        PostedTime: new Date(),
      });
  
      // Create a new thread as a child of the parent thread
      const childThread = await Thread.create({
        rootMessageId: message.id,
        parentThreadId: parentThreadId,
      });
  
      res
        .status(201)
        .json({ message: "Reply to thread created successfully", childThread });
    } catch (error) {
      console.error('Error creating reply to thread:', error);
      res.status(400).json({ message: "Error creating reply to thread", error });
    }
  };

/**
 * Get a specific forum post and its associated threads and replies.
 */
exports.getForumById = async (req, res) => {
  const { forumId } = req.params;

  try {
    const forum = await Forum.findByPk(forumId, {
      include: {
        model: Thread,
        include: [
          {
            model: Message,
            as: "RootMessage",
            include: {
              model: User,
              attributes: ["username", "avatar_url"],
            },
          },
          {
            model: Thread,
            as: "Replies",
            include: {
              model: Message,
              as: "RootMessage",
              include: {
                model: User,
                attributes: ["username", "avatar_url"],
              },
            },
          },
        ],
      },
    });

    if (!forum) {
      return res.status(404).json({ message: "Forum not found" });
    }

    res.json(forum);
  } catch (error) {
    console.error("Error fetching forum:", error);
    res.status(500).json({ message: "Error fetching forum", error });
  }
};

/**
 * Handle upvotes and downvotes for forums.
 */
exports.postVote = async (req, res) => {
  const { forumId } = req.params;
  const { voteType } = req.body; // 'upvote' or 'downvote'

  try {
    const forum = await Forum.findByPk(forumId);

    if (!forum) {
      return res.status(404).json({ message: "Forum not found" });
    }

    if (voteType === "upvote") {
      forum.NumberOfUpvotes += 1;
    } else if (voteType === "downvote") {
      forum.NumberOfDownvotes += 1;
    } else {
      return res.status(400).json({ message: "Invalid vote type" });
    }

    await forum.save();
    res.json({ message: "Vote recorded successfully", forum });
  } catch (error) {
    console.error("Error recording vote:", error);
    res.status(400).json({ message: "Error recording vote", error });
  }
};

/**
 * Handle upvotes and downvotes for messages.
 */
exports.messageVote = async (req, res) => {
  const { messageId } = req.params;
  const { voteType } = req.body; // 'upvote' or 'downvote'

  try {
    const message = await Message.findByPk(messageId);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (voteType === "upvote") {
      message.NumberOfUpvotes += 1;
    } else if (voteType === "downvote") {
      message.NumberOfDownvotes += 1;
    } else {
      return res.status(400).json({ message: "Invalid vote type" });
    }

    await message.save();
    res.json({ message: "Vote recorded successfully", message });
  } catch (error) {
    console.error("Error recording vote:", error);
    res.status(400).json({ message: "Error recording vote", error });
  }
};
