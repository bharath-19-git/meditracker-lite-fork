"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { api } from "../../services/api";

const FeedbackForm = ({ appointment, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    rating: 5,
    comment: "",
  });
  const [loading, setLoading] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRatingChange = (rating) => {
    setFormData({
      ...formData,
      rating,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/feedback", {
        appointmentId: appointment._id,
        rating: Number.parseInt(formData.rating),
        comment: formData.comment,
      });

      toast.success("🌟 Feedback submitted successfully!", {
        style: {
          background: "linear-gradient(135deg, #10b981 0%, #34d399 100%)",
          color: "white",
          borderRadius: "12px",
          padding: "16px 20px",
          boxShadow: "0 10px 25px rgba(16, 185, 129, 0.3)",
        },
      });
      onSubmit();
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to submit feedback";
      toast.error(message, {
        style: {
          background: "linear-gradient(135deg, #ef4444 0%, #f87171 100%)",
          color: "white",
          borderRadius: "12px",
          padding: "16px 20px",
          boxShadow: "0 10px 25px rgba(239, 68, 68, 0.3)",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const getRatingEmoji = (rating) => {
    switch (rating) {
      case 1:
        return "😞";
      case 2:
        return "😐";
      case 3:
        return "🙂";
      case 4:
        return "😊";
      case 5:
        return "🤩";
      default:
        return "🙂";
    }
  };

  const getRatingText = (rating) => {
    switch (rating) {
      case 1:
        return "Poor";
      case 2:
        return "Fair";
      case 3:
        return "Good";
      case 4:
        return "Very Good";
      case 5:
        return "Excellent";
      default:
        return "Good";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-scale">
      <div className="feedback-modal rounded-2xl max-w-sm w-full p-2 animate-slide-up">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-3 floating">
            <span className="text-white text-xl">⭐</span>
          </div>
          <h2 className="text-xl font-bold text-gray-800 font-display mb-1">
            Rate Your Experience
          </h2>
          <p className="text-gray-700 text-sm font-medium">
            Dr. {appointment.doctor?.name}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Rating Section */}
          <div>
            {/* Star Rating */}
            <div className="flex justify-center items-center space-x-1 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingChange(star)}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  className={`feedback-star ${
                    star <= (hoveredStar || formData.rating)
                      ? "active"
                      : "inactive"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>

            {/* Rating Display */}
            <div className="text-center">
              <div className="text-2xl mb-1">
                {getRatingEmoji(hoveredStar || formData.rating)}
              </div>
              <p className="text-sm font-bold text-gray-800">
                {getRatingText(hoveredStar || formData.rating)}
              </p>
            </div>
          </div>

          {/* Comment Section */}
          <div>
            <label
              htmlFor="comment"
              className="block text-sm font-bold text-gray-800 mb-2"
            >
              Comments (Optional)
            </label>
            <textarea
              id="comment"
              name="comment"
              rows={3}
              maxLength={150}
              className="feedback-textarea w-full resize-none text-sm"
              placeholder="Share your thoughts..."
              value={formData.comment}
              onChange={handleChange}
            />
            <p
              className={`text-xs mt-1 font-medium ${
                formData.comment.length > 130
                  ? "text-orange-600"
                  : "text-gray-600"
              }`}
            >
              {formData.comment.length}/150 characters
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="feedback-cancel-btn px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-gradient px-6 py-2 rounded-xl font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center">
                  <div className="loading-spinner w-3 h-3 mr-1"></div>
                  Submitting...
                </span>
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </form>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="feedback-close-btn absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300"
          disabled={loading}
        >
          <span className="font-bold">×</span>
        </button>
      </div>
    </div>
  );
};

export default FeedbackForm;
