"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { motion } from "framer-motion"
import { Camera, Edit, Loader2, MapPin, Plus, Star, Trash, Upload } from "lucide-react"

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [skills, setSkills] = useState<string[]>([
    "Plumbing",
    "Pipe Fitting",
    "Water Heater Installation",
    "Leak Repair",
  ])
  const [skillInput, setSkillInput] = useState("")

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()])
      setSkillInput("")
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="space-y-8 pb-20">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">My Profile</h1>
        <p className="text-gray-600 dark:text-gray-300 text-lg">Manage your professional profile and settings</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full md:w-[400px] grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Summary Card */}
              <Card className="lg:col-span-1">
                <CardHeader className="relative pb-0">
                  <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-32 h-32">
                    <Avatar className="w-32 h-32 border-4 border-white dark:border-gray-900">
                      <AvatarImage src="/placeholder.svg?height=128&width=128" alt="Profile" />
                      <AvatarFallback className="text-4xl">JS</AvatarFallback>
                    </Avatar>
                    <Button size="icon" variant="secondary" className="absolute bottom-0 right-0 rounded-full">
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="pt-16 text-center">
                    <CardTitle className="text-2xl">John Smith</CardTitle>
                    <CardDescription className="flex items-center justify-center mt-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      New York, NY
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="text-center pt-4">
                  <div className="flex justify-center gap-2 mb-4">
                    <Badge variant="outline" className="px-3 py-1">
                      <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                      4.8/5
                    </Badge>
                    <Badge variant="outline" className="px-3 py-1">
                      Professional Plumber
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
                    Experienced plumber with over 5 years of residential and commercial experience.
                  </p>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-2xl font-bold">42</p>
                      <p className="text-xs text-gray-500">Jobs</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">38</p>
                      <p className="text-xs text-gray-500">Reviews</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">5+</p>
                      <p className="text-xs text-gray-500">Years</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <Button variant="outline" className="w-full">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </CardFooter>
              </Card>

              {/* Profile Details Form */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your profile information to attract more clients</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" defaultValue="John" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" defaultValue="Smith" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue="john.smith@example.com" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" defaultValue="(555) 123-4567" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input id="location" defaultValue="New York, NY" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="rate">Hourly Rate ($)</Label>
                        <Input id="rate" defaultValue="35" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Professional Bio</Label>
                      <Textarea
                        id="bio"
                        className="min-h-[120px]"
                        defaultValue="I am a licensed plumber with over 5 years of experience in residential and commercial plumbing. I specialize in repairs, installations, and maintenance of plumbing systems. I pride myself on providing quality work, being punctual, and offering fair pricing."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="skills">Skills</Label>
                      <div className="flex gap-2">
                        <Input
                          id="skills"
                          value={skillInput}
                          onChange={(e) => setSkillInput(e.target.value)}
                          placeholder="Add a skill"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault()
                              addSkill()
                            }
                          }}
                        />
                        <Button type="button" variant="outline" size="icon" onClick={addSkill}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {skills.map((skill) => (
                          <Badge
                            key={skill}
                            variant="secondary"
                            className="cursor-pointer"
                            onClick={() => removeSkill(skill)}
                          >
                            {skill}
                            <span className="ml-1 text-xs">&times;</span>
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          "Save Changes"
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="portfolio" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Portfolio</CardTitle>
                <CardDescription>Showcase your work with photos and descriptions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <Card key={item} className="overflow-hidden">
                      <div className="relative aspect-video bg-gray-100 dark:bg-gray-800">
                        <img
                          src={`/placeholder.svg?height=200&width=300`}
                          alt={`Portfolio item ${item}`}
                          className="object-cover w-full h-full"
                        />
                        <div className="absolute top-2 right-2 flex gap-1">
                          <Button size="icon" variant="destructive" className="h-7 w-7 rounded-full">
                            <Trash className="h-3 w-3" />
                          </Button>
                          <Button size="icon" variant="secondary" className="h-7 w-7 rounded-full">
                            <Edit className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <CardContent className="p-3">
                        <h4 className="font-medium text-sm">Bathroom Renovation</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Complete plumbing overhaul for a master bathroom
                        </p>
                      </CardContent>
                    </Card>
                  ))}

                  <Card className="border-dashed flex items-center justify-center aspect-video">
                    <Button variant="ghost" className="flex flex-col h-full w-full">
                      <Upload className="h-8 w-8 mb-2 text-gray-400" />
                      <span className="text-sm">Add New Item</span>
                    </Button>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account settings and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Notifications</h3>
                  <Separator />
                  <div className="space-y-4 pt-2">
                    {["New job alerts", "Messages", "Application updates", "Newsletter"].map((item) => (
                      <div key={item} className="flex items-center justify-between">
                        <Label htmlFor={item.toLowerCase().replace(/\s+/g, "-")}>{item}</Label>
                        <input
                          type="checkbox"
                          id={item.toLowerCase().replace(/\s+/g, "-")}
                          className="toggle"
                          defaultChecked
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Privacy</h3>
                  <Separator />
                  <div className="space-y-4 pt-2">
                    {["Show profile to employers", "Allow contact by email", "Allow contact by phone"].map((item) => (
                      <div key={item} className="flex items-center justify-between">
                        <Label htmlFor={item.toLowerCase().replace(/\s+/g, "-")}>{item}</Label>
                        <input
                          type="checkbox"
                          id={item.toLowerCase().replace(/\s+/g, "-")}
                          className="toggle"
                          defaultChecked
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Security</h3>
                  <Separator />
                  <div className="space-y-4 pt-2">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input id="current-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input id="new-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input id="confirm-password" type="password" />
                    </div>
                    <Button>Change Password</Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-destructive">Danger Zone</h3>
                  <Separator className="bg-destructive/20" />
                  <div className="space-y-4 pt-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <Button variant="destructive">Delete Account</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}
