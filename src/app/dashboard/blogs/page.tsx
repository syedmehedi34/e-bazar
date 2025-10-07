"use client"
import axios from "axios";
import React, { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "react-toastify";

interface Paragraph {
    paragraph: string;
}

interface Comment {
    user: string;
    comment: string;
    date: string;
}

interface BlogFormData {
    title: string;
    category: string;
    tags: string[];
    author: string;
    date: string;
    image: string;
    shortDescription: string;
    content: Paragraph[];
    comments: Comment[];
}

const BlogsForm: React.FC = () => {
    const [formData, setFormData] = useState<BlogFormData>({
        title: "",
        category: "",
        tags: [],
        author: "",
        date: "",
        image: "",
        shortDescription: "",
        content: [{ paragraph: "" }],
        comments: [{ user: "", comment: "", date: "" }],
    });

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
        index?: number,
        type?: "content" | "comments" | "tags"
    ) => {
        if (type === "content" && index !== undefined) {
            const newContent = [...formData.content];
            newContent[index].paragraph = e.target.value;
            setFormData({ ...formData, content: newContent });
        } else if (type === "comments" && index !== undefined) {
            const newComments = [...formData.comments];
            newComments[index][e.target.name as keyof Comment] = e.target.value;
            setFormData({ ...formData, comments: newComments });
        } else if (type === "tags") {
            setFormData({
                ...formData,
                tags: e.target.value.split(",").map((tag) => tag.trim()),
            });
        } else {
            setFormData({
                ...formData,
                [e.target.name]: e.target.value,
            } as unknown as BlogFormData);
        }
    };

    const addParagraph = () => {
        setFormData({
            ...formData,
            content: [...formData.content, { paragraph: "" }],
        });
    };

    const addComment = () => {
        setFormData({
            ...formData,
            comments: [...formData.comments, { user: "", comment: "", date: "" }],
        });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        console.log(formData)
        try {
            const res = await axios.post(`http://localhost:5000/blog`, formData);
            if (res?.status === 200) {
                toast.success("Blogs post successfull")
            }
        } catch (error) {
            toast.error((error as Error).message)
        }

    };

    return (
        <div className="">
            <div className="">


                <form
                    onSubmit={handleSubmit}
                    className="space-y-6 bg-white p-4 rounded-box dark:bg-gray-800 rubik "
                >
                    <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
                        Add New Blog
                    </h2>
                    <div className="grid lg:grid-cols-4 grid-cols-2 gap-4">
                        {/* Title */}
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                Title
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                placeholder="Enter Your Title.."
                                onChange={handleChange}
                                className="input input-bordered w-full dark:bg-gray-600 dark:text-white"
                                required
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                Category
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="select select-bordered w-full dark:bg-gray-600 dark:text-white"
                                required
                            >
                                <option value="">Select category</option>
                                <option value="man">Man</option>
                                <option value="women">Women</option>
                                <option value="electrical">Electrical</option>
                                <option value="kids">Kids</option>
                                <option value="home">Home</option>
                            </select>
                        </div>

                        {/* Tags */}
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                Tags (comma separated)
                            </label>
                            <input
                                type="text"
                                name="tags"
                                value={formData.tags.join(", ")}
                                onChange={(e) => handleChange(e, undefined, "tags")}
                                className="input input-bordered w-full dark:bg-gray-600 dark:text-white"
                                placeholder="fashion, style, trends"
                            />
                        </div>

                        {/* Author */}
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                Author
                            </label>
                            <input
                                type="text"
                                name="author"
                                value={formData.author}
                                onChange={handleChange}
                                placeholder="Enter Author Name..."
                                className="input input-bordered w-full dark:bg-gray-600 dark:text-white"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Date */}
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                Date
                            </label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                className="input input-bordered w-full dark:bg-gray-600 dark:text-white"
                                required
                            />
                        </div>

                        {/* Image */}
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                Image URL
                            </label>
                            <input
                                type="text"
                                name="image"
                                value={formData.image}
                                onChange={handleChange}
                                className="input input-bordered w-full dark:bg-gray-600 dark:text-white"
                                placeholder="https://example.com/image.jpg"
                                required
                            />
                        </div>
                    </div>
                    {/* Short Description */}
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            Short Description
                        </label>
                        <textarea
                            name="shortDescription"
                            value={formData.shortDescription}
                            onChange={handleChange}
                            className="textarea textarea-bordered w-full dark:bg-gray-600 dark:text-white"
                            placeholder="Short summary of the blog"
                            required
                        />
                    </div>

                    {/* Content Paragraphs */}
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            Content
                        </label>
                        {formData.content.map((item, index) => (
                            <textarea
                                key={index}
                                value={item.paragraph}
                                onChange={(e) => handleChange(e, index, "content")}
                                className="textarea textarea-bordered w-full mb-2 dark:bg-gray-600 dark:text-white"
                                placeholder={`Paragraph ${index + 1}`}
                                required
                            />
                        ))}
                        <button
                            type="button"
                            className="btn btn-sm btn-outline"
                            onClick={addParagraph}
                        >
                            Add Paragraph
                        </button>
                    </div>

                    {/* Comments */}
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            Comments
                        </label>
                        {formData.comments.map((comment, index) => (
                            <div
                                key={index}
                                className="mb-4 border border-gray-200 rounded p-3 dark:border-gray-700"
                            >
                                <input
                                    type="text"
                                    name="user"
                                    value={comment.user}
                                    onChange={(e) => handleChange(e, index, "comments")}
                                    placeholder="User Name"
                                    className="input input-bordered w-full mb-2 dark:bg-gray-600 dark:text-white"
                                    required
                                />
                                <textarea
                                    name="comment"
                                    value={comment.comment}
                                    onChange={(e) => handleChange(e, index, "comments")}
                                    placeholder="Comment"
                                    className="textarea textarea-bordered w-full mb-2 dark:bg-gray-600 dark:text-white"
                                    required
                                />
                                <input
                                    type="date"
                                    name="date"
                                    value={comment.date}
                                    onChange={(e) => handleChange(e, index, "comments")}
                                    className="input input-bordered w-full dark:bg-gray-600 dark:text-white"
                                    required
                                />
                            </div>
                        ))}
                        <button
                            type="button"
                            className="p-2 bg-gray-600 text-white rounded-box dark:bg-gray-700"
                            onClick={addComment}
                        >
                            Add Comment
                        </button>
                    </div>

                    {/* Submit */}
                    <div className="text-right">
                        <button type="submit" className="p-2  bg-gray-800 text-white dark:bg-gray-600 cursor-pointer rounded-box w-full">
                            Submit Blog
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BlogsForm;
