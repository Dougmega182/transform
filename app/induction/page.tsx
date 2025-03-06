"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

const jobSites = ["Site A", "Site B", "Site C"];
const projectManagers = ["Oliver Trifunovski", "Matt Reid"];
const highRiskLicences = [
  "SB - Basic Scaffolding",
  "SI - Intermediate Scaffolding",
  "SA - Advanced Scaffolding",
  "PB - Concrete Placing Boom Operator",
  "CT, CV, CN, C2, C6, C1, C0 - Crane Operator",
  "Other"
];

export default function InductionForm() {
  const [formData, setFormData] = useState({
    projectName: "",
    projectManager: "",
    date: new Date().toISOString().split("T")[0],
    contractorCompany: "",
    contractorName: "",
    jobDescription: "",
    plantInvolved: "no",
    plantInduction: "",
    highRiskWork: "",
    hotWorks: "no",
    hotWorksPermit: "no",
    materialsApproval: "Agree",
    siteRules: false,
    signature: "",
    redWhiteCard: null as File | null,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleCheckboxChange: React.FormEventHandler<HTMLButtonElement> = (e) => {
    const target = e.currentTarget as HTMLInputElement;
    setFormData({ ...formData, [target.name]: target.checked });
  };
  
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData({ ...formData, redWhiteCard: file });
  };
  
  
  

  const handleSubmit = () => {
    setLoading(true);
    console.log("Form Submitted", formData);
    setTimeout(() => setLoading(false), 2000); // Simulate API call
  };

  return (
    <Card>
      <CardContent className="space-y-4">
        <label>Job Site</label>
        <select name="projectName" value={formData.projectName} onChange={handleChange} required className="w-full border p-2">
          <option value="">Select Job Site</option>
          {jobSites.map((site) => (
            <option key={site} value={site}>{site}</option>
          ))}
        </select>

        <label>Project Manager</label>
        <select name="projectManager" value={formData.projectManager} onChange={handleChange} required className="w-full border p-2">
          <option value="">Select Project Manager</option>
          {projectManagers.map((pm) => (
            <option key={pm} value={pm}>{pm}</option>
          ))}
        </select>

        <Input type="date" name="date" value={formData.date} onChange={handleChange} required />
        <Input type="text" name="contractorCompany" placeholder="Contractor Company Name" onChange={handleChange} required />
        <Input type="text" name="contractorName" placeholder="Contractor Name" onChange={handleChange} required />
        <Textarea name="jobDescription" placeholder="Description of job" onChange={handleChange} required />

        <label>Plant Involved?</label>
        <label><input type="radio" name="plantInvolved" value="yes" onChange={handleChange} /> Yes</label>
        <label><input type="radio" name="plantInvolved" value="no" onChange={handleChange} /> No</label>

        <Textarea name="plantInduction" placeholder="Plant Induction Form Details" onChange={handleChange} />
        
        <label>High Risk Work Licences</label>
        {highRiskLicences.map((licence) => (
          <label key={licence}><input type="radio" name="highRiskWork" value={licence} onChange={handleChange} /> {licence}</label>
        ))}

        <label>Hot Works?</label>
        <label><input type="radio" name="hotWorks" value="yes" onChange={handleChange} /> Yes</label>
        <label><input type="radio" name="hotWorks" value="no" onChange={handleChange} /> No</label>

        <label>Hot Works Permit?</label>
        <label><input type="radio" name="hotWorksPermit" value="yes" onChange={handleChange} /> Yes</label>
        <label><input type="radio" name="hotWorksPermit" value="no" onChange={handleChange} /> No</label>

        <label>Materials Approval</label>
        <label><input type="radio" name="materialsApproval" value="Agree" onChange={handleChange} /> Agree</label>
        <label><input type="radio" name="materialsApproval" value="Disagree" onChange={handleChange} /> Disagree</label>
        <label><input type="radio" name="materialsApproval" value="N/A" onChange={handleChange} /> N/A</label>

        <label>Upload Red/White Card</label>
        <input type="file" name="redWhiteCard" onChange={handleFileChange} />

        <label>
          <Checkbox name="siteRules" checked={formData.siteRules} onChange={handleCheckboxChange} /> I acknowledge I have read and understood the site rules
        </label>

        <Textarea name="signature" placeholder="Print Your Name" onChange={handleChange} required />
      </CardContent>

      <CardFooter>
        <Button onClick={handleSubmit} disabled={loading} className="w-full">
          {loading ? "Submitting..." : "Complete Induction"}
        </Button>
      </CardFooter>
    </Card>
  );
}