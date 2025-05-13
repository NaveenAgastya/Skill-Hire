"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { Briefcase, Clock, DollarSign, MapPin, Search } from "lucide-react"

// Sample job data
const JOBS = [
  {
    id: 1,
    title: "Residential Plumber",
    company: "HomeFixers Inc.",
    location: "New York, NY",
    type: "Full-time",
    salary: "$30-40/hr",
    posted: "2 days ago",
    description: "Looking for an experienced plumber to join our team for residential projects.",
    skills: ["Plumbing", "Pipe Fitting", "Troubleshooting"],
  },
  {
    id: 2,
    title: "Construction Worker",
    company: "BuildRight Construction",
    location: "Los Angeles, CA",
    type: "Contract",
    salary: "$25-35/hr",
    posted: "1 day ago",
    description: "General construction labor needed for commercial building project.",
    skills: ["Construction", "Physical Strength", "Safety Protocols"],
  },
  {
    id: 3,
    title: "Electrician",
    company: "PowerUp Electric",
    location: "Chicago, IL",
    type: "Part-time",
    salary: "$35-45/hr",
    posted: "3 days ago",
    description: "Certified electrician needed for residential and light commercial work.",
    skills: ["Electrical", "Wiring", "Troubleshooting"],
  },
  {
    id: 4,
    title: "Landscaper",
    company: "GreenScapes",
    location: "Miami, FL",
    type: "Seasonal",
    salary: "$20-25/hr",
    posted: "5 days ago",
    description: "Landscaping professional needed for residential properties maintenance.",
    skills: ["Landscaping", "Lawn Care", "Plant Knowledge"],
  },
  {
    id: 5,
    title: "Carpenter",
    company: "WoodWorks Custom",
    location: "Seattle, WA",
    type: "Full-time",
    salary: "$28-38/hr",
    posted: "1 week ago",
    description: "Skilled carpenter needed for custom furniture and cabinetry projects.",
    skills: ["Carpentry", "Woodworking", "Finishing"],
  },
]

export default function JobSearchPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [location, setLocation] = useState("")
  const [jobType, setJobType] = useState("")
  const [salaryRange, setSalaryRange] = useState([20, 50])

  const filteredJobs = JOBS.filter((job) => {
    return (
      (searchTerm === "" ||
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.skills.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase()))) &&
      (location === "" || job.location.includes(location)) &&
      (jobType === "" || job.type === jobType)
    )
  })

  return (
    <div className="space-y-8 pb-20">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Find Work</h1>
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          Browse available jobs that match your skills and preferences
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 lg:grid-cols-4 gap-6"
      >
        {/* Filters */}
        <Card className="lg:sticky lg:top-20 h-fit">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Refine your job search</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Job Type</label>
              <Select value={jobType} onValueChange={setJobType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Full-time">Full-time</SelectItem>
                  <SelectItem value="Part-time">Part-time</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                  <SelectItem value="Seasonal">Seasonal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Location</label>
              <Input placeholder="City, State" value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>

            <div className="space-y-4">
              <label className="text-sm font-medium">Hourly Rate ($/hr)</label>
              <div className="px-2">
                <Slider defaultValue={salaryRange} min={10} max={100} step={5} onValueChange={setSalaryRange} />
              </div>
              <div className="flex justify-between text-sm">
                <span>${salaryRange[0]}</span>
                <span>${salaryRange[1]}+</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Skills</label>
              <div className="flex flex-wrap gap-2">
                {["Plumbing", "Electrical", "Carpentry", "Painting", "Construction"].map((skill) => (
                  <Badge
                    key={skill}
                    variant="outline"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                    onClick={() => setSearchTerm(skill)}
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setSearchTerm("")
                setLocation("")
                setJobType("")
                setSalaryRange([20, 50])
              }}
            >
              Reset Filters
            </Button>
          </CardFooter>
        </Card>

        {/* Job Listings */}
        <div className="lg:col-span-3 space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search jobs by title, skill, or keyword"
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400">Showing {filteredJobs.length} jobs</p>

          {filteredJobs.length > 0 ? (
            <div className="space-y-4">
              {filteredJobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl">{job.title}</CardTitle>
                          <CardDescription className="text-base">{job.company}</CardDescription>
                        </div>
                        <Badge
                          variant={
                            job.type === "Full-time"
                              ? "default"
                              : job.type === "Part-time"
                                ? "secondary"
                                : job.type === "Contract"
                                  ? "outline"
                                  : "destructive"
                          }
                        >
                          {job.type}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{job.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {job.skills.map((skill) => (
                          <Badge key={skill} variant="secondary" className="font-normal">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {job.location}
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-1" />
                          {job.salary}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {job.posted}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" size="sm">
                        Save
                      </Button>
                      <Button size="sm">Apply Now</Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Briefcase className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">No jobs found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Try adjusting your search filters or try a different search term.
              </p>
              <Button
                onClick={() => {
                  setSearchTerm("")
                  setLocation("")
                  setJobType("")
                }}
              >
                Clear Search
              </Button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
