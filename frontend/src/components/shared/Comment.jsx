import moment from "moment";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { BiSolidLike } from "react-icons/bi";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";

// ✅ Use environment variable for backend base URL
const BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "https://samaybihar-xdtd.onrender.com";

const Comment = ({ comment, onLike, onEdit, onDelete }) => {
  const [user, setUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/user/${comment.userId}`);
        const data = await res.json();
        if (res.ok) {
          setUser(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    getUser();
  }, [comment]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedContent(comment.content);
  };

  const handleSave = async () => {
    try {
      const res = await fetch(
        `${BASE_URL}/api/comment/editComment/${comment._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: editedContent,
          }),
        }
      );

      if (res.ok) {
        setIsEditing(false);
        onEdit(comment, editedContent);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="flex p-4 border-b border-slate-300 text-sm gap-2">
      <div className="flex-shrink-0 mr-0">
        <img
          src={user.profilePicture}
          alt={user.username}
          className="w-10 h-10 rounded-full bg-gray-200"
        />
      </div>

      <div className="flex-1">
        <div className="flex items-center mb-1">
          <span className="font-semibold text-orange-500 mr-1 text-sm truncate">
            {user ? `@${user.username}` : "Unknown"}
          </span>

          <span className="text-gray-500 text-sm">
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>

        {isEditing ? (
          <>
            <Textarea
              className="mb-2"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              maxLength={200}
            />
            <div className="text-right text-xs text-gray-500 mb-2">
              {200 - editedContent.length} characters remaining
            </div>

            <div className="flex justify-end gap-2 text-sm">
              <Button
                type="button"
                className="bg-green-600"
                onClick={handleSave}
              >
                Save
              </Button>

              <Button
                type="button"
                className="hover:border-red-500 hover:text-red-500"
                variant="outline"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <span className="text-green-400 bg-[#f10404] bg-opacity-70 hover:bg-opacity-100 rounded-full shadow-2xl border-y-2 border-black font-bold hover:text-white p-2 cursor-pointer">
                    Delete
                  </span>
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>

                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your comment and remove your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-red-600"
                      onClick={() => onDelete(comment._id)}
                    >
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </>
        ) : (
          <>
            <p className="text-slate-600 pb-2">{comment.content}</p>

            <div className="flex items-center pt-2 text-sm border-t border-slate-300 max-w-fit gap-2">
              <button
                type="button"
                onClick={() => onLike(comment._id)}
                className={`text-gray-400 hover:text-blue-500 ${
                  currentUser &&
                  comment.likes.includes(currentUser._id) &&
                  "!text-blue-600"
                }`}
              >
                <BiSolidLike className="text-xl hover:text-2xl" />
              </button>

              <p className="text-gray-400">
                {comment.numberOfLikes > 0 &&
                  comment.numberOfLikes +
                    " " +
                    (comment.numberOfLikes === 1 ? "like" : "likes")}
              </p>

              {currentUser &&
                (currentUser._id === comment.userId || currentUser.isAdmin) && (
                  <button
                    type="button"
                    onClick={handleEdit}
                    className="text-blue-400 ml-2 hover:text-rose-600"
                  >
                    Edit
                  </button>
                )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Comment;
