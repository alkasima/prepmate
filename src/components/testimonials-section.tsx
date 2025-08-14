"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Star, Quote } from "lucide-react"

const testimonials = [
	{
		name: "Sarah Chen",
		role: "Software Engineer",
		company: "Google",
		image:
			"https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
		content:
			"PrepMate helped me land my dream job at Google! The AI feedback was incredibly detailed and helped me improve my technical communication skills.",
		rating: 5,
	},
	{
		name: "Marcus Johnson",
		role: "Product Manager",
		company: "Microsoft",
		image:
			"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
		content:
			"The voice-based practice sessions felt so realistic. I went into my actual interview feeling confident and prepared. Highly recommend!",
		rating: 5,
	},
	{
		name: "Emily Rodriguez",
		role: "Data Scientist",
		company: "Netflix",
		image:
			"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
		content:
			"The personalized feedback based on my resume was game-changing. PrepMate identified exactly what I needed to work on.",
		rating: 5,
	},
	{
		name: "David Kim",
		role: "UX Designer",
		company: "Airbnb",
		image:
			"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
		content:
			"I practiced over 100 questions with PrepMate. The progress tracking helped me see my improvement over time. Amazing platform!",
		rating: 5,
	},
	{
		name: "Lisa Thompson",
		role: "Marketing Director",
		company: "Spotify",
		image:
			"https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
		content:
			"The behavioral interview practice was exactly what I needed. The AI understood the nuances of different question types perfectly.",
		rating: 5,
	},
	{
		name: "Alex Rivera",
		role: "DevOps Engineer",
		company: "Amazon",
		image:
			"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
		content:
			"PrepMate's real-time feedback during voice sessions helped me eliminate filler words and speak more confidently. Worth every penny!",
		rating: 5,
	},
]

export function TestimonialsSection() {
	return (
		<section className="py-24 bg-slate-50 dark:bg-slate-800">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Testimonials removed as requested */}

				{/* Stats section */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.3 }}
					viewport={{ once: true }}
					className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
				>
					<div>
						<div className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
							50K+
						</div>
						<div className="text-slate-600 dark:text-slate-400">
							Happy Users
						</div>
					</div>
					<div>
						<div className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
							1M+
						</div>
						<div className="text-slate-600 dark:text-slate-400">
							Practice Sessions
						</div>
					</div>
					<div>
						<div className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
							95%
						</div>
						<div className="text-slate-600 dark:text-slate-400">
							Success Rate
						</div>
					</div>
					<div>
						<div className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
							4.9/5
						</div>
						<div className="text-slate-600 dark:text-slate-400">
							Average Rating
						</div>
					</div>
				</motion.div>
			</div>
		</section>
	)
}