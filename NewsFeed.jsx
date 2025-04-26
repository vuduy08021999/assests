import React, { useState } from "react";
import { Box, Container, Avatar, Typography, Stack, Divider, Button, TextField } from "@mui/material";
import { AStyle } from "../style/AStyle";

// Theme colors, similar to your app
const colors = {
    background: "#f6f9fb",
    card: "#fff",
    border: "#e6eaf1",
    text: "#222b45",
    subtext: "#8f9bb3",
    accent: "#3366ff",
    react: "#ff9800",
    comment: "#4caf50",
};

const demoPosts = [
    {
        id: 1,
        author: {
            name: "Alice Johnson",
            avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        },
        content: "Atlassian just released a new design system update! 🚀 Check out the screenshots below.",
        date: "2025-04-25T10:00:00Z",
        images: [
            "https://broken-link.example.com/img.jpg", // broken
            "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1465101162946-4377e57745c3?auto=format&fit=crop&w=400&q=80",
        ],
        reactions: 2,
        comments: [
            {
                id: 1,
                author: {
                    name: "Bob Smith",
                    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
                },
                text: "That's awesome! Where can I read more?",
                date: "2025-04-25T11:00:00Z",
            },
        ],
    },
    {
        id: 2,
        author: {
            name: "Diana Lee",
            avatar: "https://randomuser.me/api/portraits/women/65.jpg",
        },
        content: "Lunch at the park today! 🌳",
        date: "2025-04-24T12:30:00Z",
        images: [
            "https://images.unsplash.com/photo-1465101178521-c1a9136a3c5c?auto=format&fit=crop&w=400&q=80"
        ],
        reactions: 5,
        comments: [
            {
                id: 2,
                author: {
                    name: "Emily Tran",
                    avatar: "https://randomuser.me/api/portraits/women/67.jpg",
                },
                text: "Looks delicious!",
                date: "2025-04-24T13:00:00Z",
            },
        ],
    },
    {
        id: 3,
        author: {
            name: "Charlie Kim",
            avatar: "https://randomuser.me/api/portraits/men/46.jpg",
        },
        content: "Team building memories. Thanks everyone for a great day!",
        date: "2025-04-23T18:45:00Z",
        images: [
            "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=400&q=80"
        ],
        reactions: 3,
        comments: [
            {
                id: 3,
                author: {
                    name: "Alice Johnson",
                    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
                },
                text: "Such fun!",
                date: "2025-04-23T19:00:00Z",
            },
            {
                id: 4,
                author: {
                    name: "Diana Lee",
                    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
                },
                text: "Can't wait for the next one.",
                date: "2025-04-23T19:12:00Z",
            },
        ],
    },
    {
        id: 4,
        author: {
            name: "Emily Tran",
            avatar: "https://randomuser.me/api/portraits/women/67.jpg",
        },
        content: "No image here, just sharing some good news: I got certified in Agile! 🎉",
        date: "2025-04-22T09:10:00Z",
        images: [],
        reactions: 6,
        comments: [],
    },
    {
        id: 5,
        author: {
            name: "Bob Smith",
            avatar: "https://randomuser.me/api/portraits/men/45.jpg",
        },
        content: "Check out this nebula from my telescope last night! 🔭",
        date: "2025-04-20T23:40:00Z",
        images: [
            "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=400&q=80"
        ],
        reactions: 8,
        comments: [
            {
                id: 5,
                author: {
                    name: "Charlie Kim",
                    avatar: "https://randomuser.me/api/portraits/men/46.jpg",
                },
                text: "Wow! That's incredible.",
                date: "2025-04-21T00:05:00Z",
            },
        ],
    },
    {
        id: 6,
        author: {
            name: "Bob Smith",
            avatar: "https://randomuser.me/api/portraits/men/45.jpg",
        },
        content: "Check out this nebula from my telescope last night! 🔭",
        date: "2025-04-20T23:40:00Z",
        images: [
            "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=400&q=80"
        ],
        reactions: 8,
        comments: [
            {
                id: 5,
                author: {
                    name: "Charlie Kim",
                    avatar: "https://randomuser.me/api/portraits/men/46.jpg",
                },
                text: "Wow! That's incredible.",
                date: "2025-04-21T00:05:00Z",
            },
        ],
    },
    {
        id: 7,
        author: {
            name: "Bob Smith",
            avatar: "https://randomuser.me/api/portraits/men/45.jpg",
        },
        content: "Check out this nebula from my telescope last night! 🔭",
        date: "2025-04-20T23:40:00Z",
        images: [
            "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=400&q=80",
        ],
        reactions: 8,
        comments: [
            {
                id: 5,
                author: {
                    name: "Charlie Kim",
                    avatar: "https://randomuser.me/api/portraits/men/46.jpg",
                },
                text: "Wow! That's incredible.",
                date: "2025-04-21T00:05:00Z",
            },
        ],
    },
    {
        id: 8,
        author: {
            name: "Bob Smith",
            avatar: "https://randomuser.me/api/portraits/men/45.jpg",
        },
        content: "Check out this nebula from my telescope last night! 🔭",
        date: "2025-04-20T23:40:00Z",
        images: [
            "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=400&q=80",
        ],
        reactions: 8,
        comments: [
            {
                id: 5,
                author: {
                    name: "Charlie Kim",
                    avatar: "https://randomuser.me/api/portraits/men/46.jpg",
                },
                text: "Wow! That's incredible.",
                date: "2025-04-21T00:05:00Z",
            },
        ],
    },
    {
        id: 9,
        author: {
            name: "Bob Smith",
            avatar: "https://randomuser.me/api/portraits/men/45.jpg",
        },
        content: "Check out this nebula from my telescope last night! 🔭",
        date: "2025-04-20T23:40:00Z",
        images: [
            "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=400&q=80",
        ],
        reactions: 8,
        comments: [
            {
                id: 5,
                author: {
                    name: "Charlie Kim",
                    avatar: "https://randomuser.me/api/portraits/men/46.jpg",
                },
                text: "Wow! That's incredible.",
                date: "2025-04-21T00:05:00Z",
            },
        ],
    },{
        id: 10,
        author: {
            name: "Bob Smith",
            avatar: "https://randomuser.me/api/portraits/men/45.jpg",
        },
        content: "Check out this nebula from my telescope last night! 🔭",
        date: "2025-04-20T23:40:00Z",
        images: [
            "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=400&q=80",
        ],
        reactions: 8,
        comments: [
            {
                id: 5,
                author: {
                    name: "Charlie Kim",
                    avatar: "https://randomuser.me/api/portraits/men/46.jpg",
                },
                text: "Wow! That's incredible.",
                date: "2025-04-21T00:05:00Z",
            },
        ],
    },
];

function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
    }).replace(",", "");
}

function getRows(images) {
    const n = images.length;
    if (n <= 4) return [images];
    if (n === 5) return [images.slice(0, 2), images.slice(2, 5)];      // 2/3
    if (n === 6) return [images.slice(0, 3), images.slice(3, 6)];      // 3/3
    if (n === 7) return [images.slice(0, 3), images.slice(3, 7)];      // 3/4 (row 1 bigger)
    if (n >= 8) return [images.slice(0, 4), images.slice(4, 8)];       // 4/4 (max 8)
    return [images];
}

function ImagesGallery({ images }) {
    if (!images || images.length === 0) return null;
    const imagesCapped = images.slice(0, 8);
    const rows = getRows(imagesCapped);
    const gap = 12;

    return (
        <Box sx={{ mt: 1, mb: 0.5 }}>
            {rows.map((row, rowIdx) => (
                <Box
                    key={rowIdx}
                    sx={{
                        display: "grid",
                        gridTemplateColumns: `repeat(${row.length}, 1fr)`,
                        gap: `${gap}px`,
                        mb: rowIdx < rows.length - 1 ? `${gap}px` : 0,
                    }}
                >
                    {row.map((url, idx) => (
                        <ImageWithFallback
                            key={url + idx}
                            src={url}
                            alt=""
                            style={{
                                width: "100%",
                                aspectRatio: "1/1",
                                objectFit: "cover",
                                borderRadius: 2,
                                border: "1px solid #e6eaf1",
                                background: "#f3f6fa",
                                display: "block",
                            }}
                        />
                    ))}
                </Box>
            ))}
        </Box>
    );
}
function ImageWithFallback({ src, alt, style }) {
    const [error, setError] = useState(false);
    return error ? (
        <Box
            sx={{
                ...style,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#bdbdbd",
                fontSize: 22,
                background: "#f3f6fa",
            }}
        >
            <span role="img" aria-label="broken">🖼️</span>
        </Box>
    ) : (
        <img
            src={src}
            alt={alt}
            style={style}
            onError={() => setError(true)}
            loading="lazy"
        />
    );
}

function Post({ post, onReact, onAddComment }) {
    const [commentValue, setCommentValue] = useState("");
    const [showComments, setShowComments] = useState(false);

    return (
        <Box
            sx={{
                bgcolor: colors.card,
                border: `1px solid ${colors.border}`,
                borderRadius: 3,
                px: { xs: 2, sm: 4 },
                pt: { xs: 2, sm: 2.5 },
                pb: 2,
                mb: 3,
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                maxWidth: 720,
                mx: "auto"
            }}
        >
            {/* Author and date */}
            <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                <Avatar
                    src={post.author.avatar}
                    alt={post.author.name}
                    sx={{ width: 36, height: 36, mr: 1 }}
                />
                <Typography fontWeight={600} color={colors.text} fontSize={16}>
                    {post.author.name}
                </Typography>
                <Typography color={colors.subtext} fontSize={13} sx={{ ml: 1 }}>
                    {formatDate(post.date)}
                </Typography>
            </Stack>
            {/* Content */}
            <Typography color={colors.text} fontSize={16} sx={{ mb: 1, lineHeight: 1.7 }}>
                {post.content}
            </Typography>
            {/* Images */}
            <ImagesGallery images={post.images} />

            <Stack direction="row" spacing={2} alignItems="center" mt={1} mb={0.5}>
                <Button
                    variant="text"
                    size="small"
                    sx={{ color: colors.react, fontWeight: 600, minWidth: 0, px: 1 }}
                    onClick={onReact}
                    startIcon={<span role="img" aria-label="like">👍</span>}
                >
                    {post.reactions || ""}
                </Button>
                <Button
                    variant="text"
                    size="small"
                    sx={{ color: colors.comment, fontWeight: 600, minWidth: 0, px: 1 }}
                    onClick={() => setShowComments((v) => !v)}
                    startIcon={<span role="img" aria-label="comment">💬</span>}
                >
                    {post.comments.length}
                </Button>
            </Stack>

            {showComments && (
                <Box mt={1.5}>
                    {post.comments.map((c) => (
                        <Stack direction="row" alignItems="flex-start" spacing={1} mb={1} key={c.id}>
                            <Avatar src={c.author.avatar} alt={c.author.name} sx={{ width: 28, height: 28 }} />
                            <Box>
                                <Typography fontWeight={500} color={colors.text} fontSize={14} component="span">
                                    {c.author.name}
                                </Typography>
                                <Typography color={colors.subtext} fontSize={12} component="span" sx={{ ml: 1 }}>
                                    {formatDate(c.date)}
                                </Typography>
                                <Box color={colors.text} fontSize={15} mt={0.5}>
                                    {c.text}
                                </Box>
                            </Box>
                        </Stack>
                    ))}
                    <Box component="form"
                        onSubmit={e => {
                            e.preventDefault();
                            if (commentValue.trim()) {
                                onAddComment(commentValue);
                                setCommentValue("");
                            }
                        }}
                        mt={2}
                        display="flex"
                        gap={1}
                    >
                        <TextField
                            variant="outlined"
                            size="small"
                            placeholder="Viết bình luận…"
                            value={commentValue}
                            onChange={e => setCommentValue(e.target.value)}
                            sx={{
                                bgcolor: "#f9fafb",
                                flex: 1,
                                borderRadius: 2,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2
                                }
                            }}
                            inputProps={{ style: { fontSize: 15 } }}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{
                                bgcolor: colors.accent,
                                color: "#fff",
                                fontWeight: 600,
                                borderRadius: 2,
                                px: 2.5,
                                boxShadow: "0 1px 2px rgba(51,102,255,0.08)",
                                textTransform: "none",
                                fontSize: 15,
                                ":hover": { bgcolor: "#234be7" }
                            }}
                        >
                            Gửi
                        </Button>
                    </Box>
                </Box>
            )}
        </Box>
    );
}

export default function NewsFeed() {
    const [posts, setPosts] = useState(demoPosts);

    const handleReact = postId => {
        setPosts(posts =>
            posts.map(post =>
                post.id === postId
                    ? { ...post, reactions: (post.reactions || 0) + 1 }
                    : post
            )
        );
    };

    const handleAddComment = (postId, text) => {
        setPosts(posts =>
            posts.map(post =>
                post.id === postId
                    ? {
                        ...post,
                        comments: [
                            ...post.comments,
                            {
                                id: Date.now(),
                                author: {
                                    name: "You",
                                    avatar: "https://randomuser.me/api/portraits/lego/1.jpg",
                                },
                                text,
                                date: new Date().toISOString(),
                            },
                        ],
                    }
                    : post
            )
        );
    };

    return (
        <Box sx={{
            ...AStyle.Group,
            height: "100vh",
            flexGrow: 1,
            overflowY: "scroll",
            justifyContent: "center"
        }} className="visible-scrollbar">
            <Container
                sx={{
                    maxWidth: { xs: 430, sm: 680, md: 900, lg: 1080 },
                    px: { xs: 0.5, sm: 3, md: 4 },
                    py: { xs: 1, sm: 2 },
                    my: "64px"
                }}
                maxWidth={false}
            >
                {posts.map(post => (
                    <Post
                        key={post.id}
                        post={post}
                        onReact={() => handleReact(post.id)}
                        onAddComment={text => handleAddComment(post.id, text)}
                    />
                ))}
            </Container>
        </Box>
    );
}