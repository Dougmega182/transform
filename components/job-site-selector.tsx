"use client"

import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

type JobSite = {
  id: string
  name: string
}

type JobSiteSelectorProps = {
  jobSites: JobSite[]
  onSelect: (jobSite: JobSite) => void
}

export function JobSiteSelector({ jobSites, onSelect }: JobSiteSelectorProps) {
  const [open, setOpen] = useState(false)
  const [selectedJobSite, setSelectedJobSite] = useState<JobSite | null>(null)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          {selectedJobSite ? selectedJobSite.name : "Select job site..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search job site..." />
          <CommandList>
            <CommandEmpty>No job site found.</CommandEmpty>
            <CommandGroup>
              {jobSites.map((jobSite) => (
                <CommandItem
                  key={jobSite.id}
                  onSelect={() => {
                    setSelectedJobSite(jobSite)
                    setOpen(false)
                    onSelect(jobSite)
                  }}
                >
                  <Check
                    className={cn("mr-2 h-4 w-4", selectedJobSite?.id === jobSite.id ? "opacity-100" : "opacity-0")}
                  />
                  {jobSite.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

