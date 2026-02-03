import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { feedService } from '../services';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchFeed();
  }, [page]);

  const fetchFeed = async () => {
    setLoading(true);
    try {
      const data = await feedService.getFeed(page);
      setPosts(data.feedPosts);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error fetching feed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      await feedService.likePost(postId);
      fetchFeed(); // Refresh feed
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold mb-8">Community Feed</h1>
        <p className="text-gray-600 mb-8">
          See the love spreading across our community
        </p>

        {posts.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-xl text-gray-600">No posts yet</p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <motion.div
                key={post._id}
                whileHover={{ scale: 1.02 }}
                className="card"
              >
                <div className="flex gap-4">
                  {/* Sender Info */}
                  <div className="flex-shrink-0">
                    {post.isAnonymous ? (
                      <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-2xl">🤫</span>
                      </div>
                    ) : (
                      <img
                        src={post.sender?.profileImage || 'https://via.placeholder.com/50'}
                        alt={post.sender?.name}
                        className="w-12 h-12 rounded-full"
                      />
                    )}
                  </div>

                  <div className="flex-1">
                    {/* Post Header */}
                    <div className="mb-3">
                      <p className="font-semibold">
                        {post.isAnonymous ? 'Someone Special' : post.sender?.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        sent a gift to {post.recipient?.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(post.createdAt).toLocaleString()}
                      </p>
                    </div>

                    {/* Gift Image */}
                    {post.giftPackage?.images?.[0] && (
                      <img
                        src={post.giftPackage.images[0].url}
                        alt="Gift"
                        className="w-full h-64 object-cover rounded-lg mb-3"
                      />
                    )}

                    {/* Message */}
                    {post.message && (
                      <div className="bg-gray-50 p-3 rounded-lg mb-3">
                        <p className="text-sm italic">"{post.message}"</p>
                      </div>
                    )}

                    {/* Reaction */}
                    {post.reaction && (
                      <div className="bg-primary-50 p-3 rounded-lg mb-3">
                        <p className="text-sm font-semibold text-primary-700">
                          Recipient's Reaction: {post.reaction.type}
                        </p>
                        {post.reaction.message && (
                          <p className="text-sm text-gray-700 mt-1">
                            "{post.reaction.message}"
                          </p>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-4 mt-3">
                      <button
                        onClick={() => handleLike(post._id)}
                        className="flex items-center gap-2 text-gray-600 hover:text-primary-600"
                      >
                        <span>❤️</span>
                        <span>{post.likes}</span>
                      </button>
                      <button className="text-gray-600 hover:text-primary-600">
                        💬 {post.comments?.length || 0}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="btn btn-outline"
            >
              Previous
            </button>
            <span className="flex items-center px-4">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              className="btn btn-outline"
            >
              Next
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Feed;
