"use client"

import { useState } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Leaf, Flame, Zap, Recycle, Lightbulb, Sparkles } from "lucide-react"
import Link from "next/link"

export default function FAQ() {
  const [selectedCategory, setSelectedCategory] = useState("all")

  const faqData = [
    {
      id: "item-1",
      question: "What is agricultural waste?",
      answer: "Agricultural waste includes crop residues, fruit & vegetable waste, animal manure, and agro-industry by-products that remain after farming or processing activities. These materials, when properly managed, can become valuable resources for sustainable farming practices.",
      category: "basics"
    },
    {
      id: "item-2",
      question: "Why should we avoid burning crop residues?",
      answer: "Burning releases harmful greenhouse gases, reduces soil fertility, and contributes to air pollution. Instead, residues can be used for compost, biogas, or animal feed.",
      category: "environment"
    },
    {
      id: "item-3",
      question: "How can agricultural waste be used for energy?",
      answer: "Agricultural waste like manure and crop residues can be converted into biogas or biomass energy, providing a renewable and sustainable source of power.",
      category: "energy"
    },
    {
      id: "item-4",
      question: "What resources are needed for composting?",
      answer: "Farmers need a compost pit or vermicomposting unit, proper moisture control, and organic waste materials such as leaves, straw, or manure.",
      category: "composting"
    },
    {
      id: "item-5",
      question: "Can I sell my agricultural waste?",
      answer: "Yes! Many industries purchase agro-waste for biomass fuel, compost production, or raw material processing. Farmers can benefit financially while reducing waste.",
      category: "business"
    }
  ]

  const categories = [
    { name: "All", value: "all", icon: Sparkles },
    { name: "Basics", value: "basics", icon: Leaf },
    { name: "Environment", value: "environment", icon: Flame },
    { name: "Energy", value: "energy", icon: Zap },
    { name: "Composting", value: "composting", icon: Recycle },
    { name: "Business", value: "business", icon: Lightbulb },
  ]

  const filteredFAQ = faqData.filter(item =>
    (selectedCategory === "all" || item.category === selectedCategory) 
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50 py-12">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-bold">🌱 FAQ - Waste Management</h1>
          <p className="text-muted-foreground">Find answers to common questions about agricultural waste & sustainability.</p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <Button
                key={category.value}
                variant={selectedCategory === category.value ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.value)}
                className="flex items-center gap-2"
              >
                <Icon className="w-4 h-4" />
                {category.name}
              </Button>
            )
          })}
        </div>

        {/* FAQ List */}
        {filteredFAQ.length > 0 ? (
          <Accordion type="single" collapsible className=" space-y-4">
            {filteredFAQ.map((item) => {
              return (
                <AccordionItem key={item.id} value={item.id}>
                  <AccordionTrigger className="flex  gap-3">
                   
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent>
                    <Card className="bg-green-50 border-green-100">
                      <CardHeader>
                        <CardTitle className="text-lg">Answer</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{item.answer}</p>
                      </CardContent>
                    </Card>
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>
        ) : (
          <div className="text-center text-muted-foreground py-12">
            ❌ No questions found. Try adjusting your search or category filter.
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center space-y-4 mt-12">
          <h3 className="text-2xl font-semibold">Still need help?</h3>
          <p className="text-muted-foreground">Connect with experts for personalized guidance on sustainable waste management.</p>
          <div className="flex gap-4 justify-center">
            <Link href={"/contact-us"}><Button>Contact Expert</Button></Link>
          </div>
        </div>
      </div>
    </div>
  )
}
