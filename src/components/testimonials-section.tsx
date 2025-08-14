"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Software Engineer",
    company: "Google",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    content: "PrepMate helped me land my dream job at Google! The AI feedback was incredibly detailed and helped me improve my technical communication skills.",
    rating: 5
  },
  {
    name: "Marcus Johnson",
    role: "Product Manager",
    company: "Microsoft",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    content: "The voice-based practice sessions felt so realistic. I went into my actual interview feeling confident and prepared. Highly recommend!",
    rating: 5
  },
  {
    name: "Emily Rodriguez",
    role: "Data Scientist",
    company: "Netflix",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    content: "The personalized feedback based on my resume was game-changing. PrepMate identified exactly what I needed to work on.",
    rating: 5
  },
  {
    name: "David Kim",
    role: "UX Designer",
    company: "Airbnb",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    content: "I practiced over 100 questions with PrepMate. The progress tracking helped me see my improvement over time. Amazing platform!",
    rating: 5
  },
  {
    name: "Lisa Thompson",
    role: "Marketing Director",
    company: "Spotify",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    content: "The behavioral interview practice was exactly what I needed. The AI understood the nuances of different question types perfectly.",
    rating: 5
  },
  {
    name: "Alex Rivera",
    role: "DevOps Engineer",
    company: "Amazon",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    content: "PrepMate's real-time feedback during voice sessions helped me eliminate filler words and speak more confidently. Worth every penny!",
    rating: 5
  }
]

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Loved by
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Thousands</span>
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Join successful candidates who have aced their interviews with PrepMate
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <Card className="relative h-full border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-white via-slate-50/30 to-white dark:from-slate-900 dark:via-slate-800/30 dark:to-slate-900 group-hover:scale-105 overflow-hidden">
                {/* Gradient border effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <CardContent className="relative p-8">
                  {/* Quote icon with animation */}
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 15 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Quote className="w-10 h-10 text-blue-500 mb-6" />
                  </motion.div>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  {/* Content */}
                  <p className="text-slate-700 dark:text-slate-300 mb-6 leading-relaxed">
                    "{testimonial.content}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-4">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="relative"
                    >
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-14 h-14 rounded-full object-cover border-2 border-white dark:border-slate-700 shadow-lg"
                      />
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </motion.div>
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white text-lg">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                        {testimonial.role} at <span className="text-blue-600 dark:text-blue-400">{testimonial.company}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Stats section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
        >
          <div>
            <div className="text-4xl font-bold text-slate-900 dark:text-white mb-2">50K+</div>
            <div className="text-slate-600 dark:text-slate-400">Happy Users</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-slate-900 dark:text-white mb-2">1M+</div>
            <div className="text-slate-600 dark:text-slate-400">Practice Sessions</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-slate-900 dark:text-white mb-2">95%</div>
            <div className="text-slate-600 dark:text-slate-400">Success Rate</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-slate-900 dark:text-white mb-2">4.9/5</div>
            <div className="text-slate-600 dark:text-slate-400">Average Rating</div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}