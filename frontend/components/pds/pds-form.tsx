"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Save, Plus, Trash2, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
// @ts-ignore - country-list doesn't have TypeScript types
import { getNames } from "country-list";

interface PdsFormProps {
  initialData: any;
  onSave: (data: any) => void;
  isLoading?: boolean;
}

export function PdsForm({ initialData, onSave, isLoading }: PdsFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: initialData,
  });
  const formData = watch();

  // Get list of countries for dropdown (sorted alphabetically)
  const countryList = getNames().sort();

  useEffect(() => {
    // Update form when initialData changes
    Object.keys(initialData).forEach((key) => {
      setValue(key as any, initialData[key]);
    });
  }, [initialData, setValue]);

  const onSubmit = (data: any) => {
    // Get the current form values to ensure all changes are captured
    const currentFormData = watch();
    onSave(currentFormData);
  };

  // Add/remove functions for arrays
  const addChild = () => {
    const children = formData.familyData?.children || [];
    setValue("familyData.children", [...children, { name: "", birthDate: "" }]);
  };

  const removeChild = (index: number) => {
    const children = formData.familyData?.children || [];
    setValue(
      "familyData.children",
      children.filter((_: any, i: number) => i !== index)
    );
  };

  const addWorkExperience = () => {
    const work = formData.workExperienceData?.workExperience || [];
    setValue("workExperienceData.workExperience", [
      ...work,
      {
        from: "",
        to: "",
        positionTitle: "",
        department: "",
        monthlySalary: "",
        salaryGrade: "",
        statusOfAppointment: "",
        governmentService: "",
      },
    ]);
  };

  const removeWorkExperience = (index: number) => {
    const work = formData.workExperienceData?.workExperience || [];
    setValue(
      "workExperienceData.workExperience",
      work.filter((_: any, i: number) => i !== index)
    );
  };

  const addVoluntaryWork = () => {
    const vol = formData.voluntaryWorkData?.voluntaryWork || [];
    setValue("voluntaryWorkData.voluntaryWork", [
      ...vol,
      {
        organization: "",
        dateFrom: "",
        dateTo: "",
        numberOfHours: "",
        position: "",
      },
    ]);
  };

  const removeVoluntaryWork = (index: number) => {
    const vol = formData.voluntaryWorkData?.voluntaryWork || [];
    setValue(
      "voluntaryWorkData",
      vol.filter((_: any, i: number) => i !== index)
    );
  };

  const addTrainingProgram = () => {
    const training = formData.trainingProgramsData?.trainingPrograms || [];
    setValue("trainingProgramsData.trainingPrograms", [
      ...training,
      {
        title: "",
        inclusiveDatesFrom: "",
        inclusiveDatesTo: "",
        hours: "",
        type: "",
        conductedBy: "",
      },
    ]);
  };

  const removeTrainingProgram = (index: number) => {
    const training = formData.trainingProgramsData?.trainingPrograms || [];
    setValue(
      "trainingProgramsData.trainingPrograms",
      training.filter((_: any, i: number) => i !== index)
    );
  };

  const addEligibility = () => {
    const eligibility = formData.civilServiceData?.eligibility || [];
    setValue("civilServiceData.eligibility", [
      ...eligibility,
      {
        careerService: "",
        rating: "",
        dateOfExamination: "",
        placeOfExamination: "",
        licenseNumber: "",
        dateOfValidity: "",
      },
    ]);
  };

  const removeEligibility = (index: number) => {
    const eligibility = formData.civilServiceData?.eligibility || [];
    setValue(
      "civilServiceData.eligibility",
      eligibility.filter((_: any, i: number) => i !== index)
    );
  };

  // Add/remove functions for otherInfo arrays
  const addSkill = () => {
    const skills = formData.otherInfo?.skills || [];
    if (skills.length < 7) {
      setValue("otherInfo.skills", [...skills, ""]);
    }
  };

  const removeSkill = (index: number) => {
    const skills = formData.otherInfo?.skills || [];
    setValue(
      "otherInfo.skills",
      skills.filter((_: any, i: number) => i !== index)
    );
  };

  const addNonAcad = () => {
    const nonAcad = formData.otherInfo?.nonAcad || [];
    if (nonAcad.length < 7) {
      setValue("otherInfo.nonAcad", [...nonAcad, ""]);
    }
  };

  const removeNonAcad = (index: number) => {
    const nonAcad = formData.otherInfo?.nonAcad || [];
    setValue(
      "otherInfo.nonAcad",
      nonAcad.filter((_: any, i: number) => i !== index)
    );
  };

  const addMember = () => {
    const member = formData.otherInfo?.member || [];
    if (member.length < 7) {
      setValue("otherInfo.member", [...member, ""]);
    }
  };

  const removeMember = (index: number) => {
    const member = formData.otherInfo?.member || [];
    setValue(
      "otherInfo.member",
      member.filter((_: any, i: number) => i !== index)
    );
  };

  // Add/remove functions for references
  const addReference = () => {
    const references = formData.lastpData?.references || [];
    if (references.length < 3) {
      setValue("lastpData.references", [
        ...references,
        { name: "", address: "", tel: "" },
      ]);
    }
  };

  const removeReference = (index: number) => {
    const references = formData.lastpData?.references || [];
    setValue(
      "lastpData.references",
      references.filter((_: any, i: number) => i !== index)
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-9">
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="family">Family</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="civil-service">Civil Service</TabsTrigger>
          <TabsTrigger value="work">Work</TabsTrigger>
          <TabsTrigger value="other">Other</TabsTrigger>
          <TabsTrigger value="disclosures">Disclosures</TabsTrigger>
          <TabsTrigger value="references">References</TabsTrigger>
          <TabsTrigger value="declaration">Declaration</TabsTrigger>
        </TabsList>

        {/* Personal Information Tab */}
        <TabsContent value="personal" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="personalData.surname">Surname *</Label>
                  <Input
                    id="personalData.surname"
                    {...register("personalData.surname", { required: true })}
                  />
                </div>
                <div>
                  <Label htmlFor="personalData.firstName">First Name *</Label>
                  <Input
                    id="personalData.firstName"
                    {...register("personalData.firstName", { required: true })}
                  />
                </div>
                <div>
                  <Label htmlFor="personalData.middleName">Middle Name</Label>
                  <Input
                    id="personalData.middleName"
                    {...register("personalData.middleName")}
                  />
                </div>
                <div>
                  <Label htmlFor="personalData.nameExtension">
                    Name Extension
                  </Label>
                  <Select
                    value={
                      formData.personalData?.nameExtension
                        ? formData.personalData.nameExtension
                        : "None"
                    }
                    onValueChange={(value) =>
                      setValue(
                        "personalData.nameExtension",
                        value === "None" ? "" : value
                      )
                    }
                  >
                    <SelectTrigger id="personalData.nameExtension">
                      <SelectValue placeholder="Select name extension" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="None">None</SelectItem>
                      <SelectItem value="Jr.">Jr.</SelectItem>
                      <SelectItem value="Sr.">Sr.</SelectItem>
                      <SelectItem value="II">II</SelectItem>
                      <SelectItem value="III">III</SelectItem>
                      <SelectItem value="IV">IV</SelectItem>
                      <SelectItem value="V">V</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="personalData.dateOfBirth">
                    Date of Birth *
                  </Label>
                  <Input
                    id="personalData.dateOfBirth"
                    type="date"
                    {...register("personalData.dateOfBirth", {
                      required: true,
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="personalData.placeOfBirth">
                    Place of Birth *
                  </Label>
                  <Input
                    id="personalData.placeOfBirth"
                    {...register("personalData.placeOfBirth", {
                      required: true,
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="personalData.sex">Sex *</Label>
                  <Select
                    value={formData.personalData?.sex || ""}
                    onValueChange={(value) =>
                      setValue("personalData.sex", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select sex" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="personalData.civilStatus">
                    Civil Status *
                  </Label>
                  <Select
                    value={formData.personalData?.civilStatus || ""}
                    onValueChange={(value) =>
                      setValue("personalData.civilStatus", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select civil status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Single">Single</SelectItem>
                      <SelectItem value="Married">Married</SelectItem>
                      <SelectItem value="Widowed">Widowed</SelectItem>
                      <SelectItem value="Separated">Separated</SelectItem>
                      <SelectItem value="Others">Others</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="personalData.height">Height (m)</Label>
                  <Input
                    id="personalData.height"
                    {...register("personalData.height")}
                  />
                </div>
                <div>
                  <Label htmlFor="personalData.weight">Weight (kg)</Label>
                  <Input
                    id="personalData.weight"
                    {...register("personalData.weight")}
                  />
                </div>
                <div>
                  <Label htmlFor="personalData.bloodType">Blood Type</Label>
                  <Select
                    value={
                      formData.personalData?.bloodType
                        ? formData.personalData.bloodType
                        : "None"
                    }
                    onValueChange={(value) =>
                      setValue(
                        "personalData.bloodType",
                        value === "None" ? "" : value
                      )
                    }
                  >
                    <SelectTrigger id="personalData.bloodType">
                      <SelectValue placeholder="Select blood type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="None">None</SelectItem>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="personalData.email">Email *</Label>
                  <Input
                    id="personalData.email"
                    type="email"
                    {...register("personalData.email", { required: true })}
                  />
                </div>
                <div>
                  <Label htmlFor="personalData.telephoneNo">
                    Telephone No.
                  </Label>
                  <Input
                    id="personalData.telephoneNo"
                    {...register("personalData.telephoneNo")}
                  />
                </div>
                <div>
                  <Label htmlFor="personalData.mobileNo">Mobile No. *</Label>
                  <Input
                    id="personalData.mobileNo"
                    {...register("personalData.mobileNo")}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Residential Address</Label>
                  <div className="space-y-2 mt-2">
                    <Input
                      placeholder="House/Block/Lot No."
                      {...register(
                        "personalData.residentialAddress.houseBlockLotNo"
                      )}
                    />
                    <Input
                      placeholder="Street"
                      {...register("personalData.residentialAddress.street")}
                    />
                    <Input
                      placeholder="Subdivision/Village"
                      {...register(
                        "personalData.residentialAddress.subdivisionVillage"
                      )}
                    />
                    <Input
                      placeholder="Barangay"
                      {...register("personalData.residentialAddress.barangay")}
                    />
                    <Input
                      placeholder="City/Municipality"
                      {...register(
                        "personalData.residentialAddress.cityMunicipality"
                      )}
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        placeholder="Province"
                        {...register(
                          "personalData.residentialAddress.province"
                        )}
                      />
                      <Input
                        placeholder="Zip Code"
                        {...register("personalData.residentialAddress.zipCode")}
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <Label>Permanent Address</Label>
                  <div className="space-y-2 mt-2">
                    <Input
                      placeholder="House/Block/Lot No."
                      {...register(
                        "personalData.permanentAddress.houseBlockLotNo"
                      )}
                    />
                    <Input
                      placeholder="Street"
                      {...register("personalData.permanentAddress.street")}
                    />
                    <Input
                      placeholder="Subdivision/Village"
                      {...register(
                        "personalData.permanentAddress.subdivisionVillage"
                      )}
                    />
                    <Input
                      placeholder="Barangay"
                      {...register("personalData.permanentAddress.barangay")}
                    />
                    <Input
                      placeholder="City/Municipality"
                      {...register(
                        "personalData.permanentAddress.cityMunicipality"
                      )}
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        placeholder="Province"
                        {...register("personalData.permanentAddress.province")}
                      />
                      <Input
                        placeholder="Zip Code"
                        {...register("personalData.permanentAddress.zipCode")}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Citizenship Section */}
              <div className="space-y-4 border-t pt-4">
                <div>
                  <Label className="text-base font-semibold">16. CITIZENSHIP</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    If holder of dual citizenship, please indicate the details.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="flex flex-row gap-6">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="citizenship-filipino"
                        checked={formData.personalData?.citizenship === 'Filipino'}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setValue("personalData.citizenship", "Filipino");
                            setValue("personalData.dualCitizenshipType", "");
                            setValue("personalData.dualCitizenshipCountry", "");
                          } else {
                            setValue("personalData.citizenship", "");
                          }
                        }}
                      />
                      <Label htmlFor="citizenship-filipino" className="font-normal cursor-pointer">
                        Filipino
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="citizenship-dual"
                        checked={!!formData.personalData?.dualCitizenshipType}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setValue("personalData.citizenship", "");
                            // Set a temporary value to enable dual citizenship mode
                            // User will then select by birth or naturalization
                            if (!formData.personalData?.dualCitizenshipType) {
                              setValue("personalData.dualCitizenshipType", "Dual");
                            }
                          } else {
                            setValue("personalData.dualCitizenshipType", "");
                            setValue("personalData.dualCitizenshipCountry", "");
                          }
                        }}
                      />
                      <Label htmlFor="citizenship-dual" className="font-normal cursor-pointer">
                        Dual Citizenship
                      </Label>
                    </div>
                  </div>

                  {formData.personalData?.dualCitizenshipType && (
                    <div className="space-y-4 pl-6 border-l-2">
                      <div className="flex flex-row gap-6">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="dual-birth"
                            checked={formData.personalData?.dualCitizenshipType === 'By Birth'}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setValue("personalData.dualCitizenshipType", "By Birth");
                                setValue("personalData.citizenship", "");
                              } else {
                                // If unchecking, check if naturalization is also unchecked
                                // If both are unchecked, clear dual citizenship
                                if (formData.personalData?.dualCitizenshipType !== 'By Naturalization') {
                                  setValue("personalData.dualCitizenshipType", "");
                                  setValue("personalData.dualCitizenshipCountry", "");
                                }
                              }
                            }}
                          />
                          <Label htmlFor="dual-birth" className="font-normal cursor-pointer">
                            by birth
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="dual-naturalization"
                            checked={formData.personalData?.dualCitizenshipType === 'By Naturalization'}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setValue("personalData.dualCitizenshipType", "By Naturalization");
                                setValue("personalData.citizenship", "");
                              } else {
                                // If unchecking, check if birth is also unchecked
                                // If both are unchecked, clear dual citizenship
                                if (formData.personalData?.dualCitizenshipType !== 'By Birth') {
                                  setValue("personalData.dualCitizenshipType", "");
                                  setValue("personalData.dualCitizenshipCountry", "");
                                }
                              }
                            }}
                          />
                          <Label htmlFor="dual-naturalization" className="font-normal cursor-pointer">
                            by naturalization
                          </Label>
                        </div>
                      </div>
                      <div>
                        <Label>Pls. indicate country:</Label>
                        <Select
                          value={formData.personalData?.dualCitizenshipCountry || ""}
                          onValueChange={(value) =>
                            setValue("personalData.dualCitizenshipCountry", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                          <SelectContent className="max-h-[300px]">
                            {countryList.map((country: string) => (
                              <SelectItem key={country} value={country}>
                                {country}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="personalData.gsisId">GSIS ID No.</Label>
                  <Input
                    id="personalData.gsisId"
                    {...register("personalData.gsisId")}
                  />
                </div>
                <div>
                  <Label htmlFor="personalData.pagibigId">
                    Pag-IBIG ID No.
                  </Label>
                  <Input
                    id="personalData.pagibigId"
                    {...register("personalData.pagibigId")}
                  />
                </div>
                <div>
                  <Label htmlFor="personalData.philhealthId">
                    PhilHealth No.
                  </Label>
                  <Input
                    id="personalData.philhealthId"
                    {...register("personalData.philhealthId")}
                  />
                </div>
                <div>
                  <Label htmlFor="personalData.sssId">SSS No.</Label>
                  <Input
                    id="personalData.sssId"
                    {...register("personalData.sssId")}
                  />
                </div>
                <div>
                  <Label htmlFor="personalData.tin">TIN</Label>
                  <Input
                    id="personalData.tin"
                    {...register("personalData.tin")}
                  />
                </div>
                <div>
                  <Label htmlFor="personalData.agencyEmployeeNo">
                    Agency Employee No.
                  </Label>
                  <Input
                    id="personalData.agencyEmployeeNo"
                    {...register("personalData.agencyEmployeeNo")}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Family Background Tab */}
        <TabsContent value="family" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Family Background</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Spouse</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Surname</Label>
                    <Input {...register("familyData.spouse.surname")} />
                  </div>
                  <div>
                    <Label>First Name</Label>
                    <Input {...register("familyData.spouse.firstName")} />
                  </div>
                  <div>
                    <Label>Middle Name</Label>
                    <Input {...register("familyData.spouse.middleName")} />
                  </div>
                  <div>
                    <Label>Name Extension (JR., SR)</Label>
                    <Select
                      value={
                        formData.familyData?.spouse?.nameExtension
                          ? formData.familyData.spouse.nameExtension
                          : "None"
                      }
                      onValueChange={(value) =>
                        setValue(
                          "familyData.spouse.nameExtension",
                          value === "None" ? "" : value
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select name extension" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="None">None</SelectItem>
                        <SelectItem value="Jr.">Jr.</SelectItem>
                        <SelectItem value="Sr.">Sr.</SelectItem>
                        <SelectItem value="II">II</SelectItem>
                        <SelectItem value="III">III</SelectItem>
                        <SelectItem value="IV">IV</SelectItem>
                        <SelectItem value="V">V</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Occupation</Label>
                    <Input {...register("familyData.spouse.occupation")} />
                  </div>
                  <div>
                    <Label>Employer/Business Name</Label>
                    <Input {...register("familyData.spouse.employer")} />
                  </div>
                  <div className="col-span-2">
                    <Label>Business Address</Label>
                    <Textarea
                      {...register("familyData.spouse.businessAddress")}
                    />
                  </div>
                  <div>
                    <Label>Telephone No.</Label>
                    <Input {...register("familyData.spouse.telephone")} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Father</h3>
                  <div className="space-y-4">
                    <div>
                      <Label>Surname</Label>
                      <Input {...register("familyData.father.surname")} />
                    </div>
                    <div>
                      <Label>First Name</Label>
                      <Input {...register("familyData.father.firstName")} />
                    </div>
                    <div>
                      <Label>Middle Name</Label>
                      <Input {...register("familyData.father.middleName")} />
                    </div>
                    <div>
                      <Label>Name Extension (JR., SR)</Label>
                      <Select
                        value={
                          formData.familyData?.father?.nameExtension
                            ? formData.familyData.father.nameExtension
                            : "None"
                        }
                        onValueChange={(value) =>
                          setValue(
                            "familyData.father.nameExtension",
                            value === "None" ? "" : value
                          )
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select name extension" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="None">None</SelectItem>
                          <SelectItem value="Jr.">Jr.</SelectItem>
                          <SelectItem value="Sr.">Sr.</SelectItem>
                          <SelectItem value="II">II</SelectItem>
                          <SelectItem value="III">III</SelectItem>
                          <SelectItem value="IV">IV</SelectItem>
                          <SelectItem value="V">V</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Mother</h3>
                  <div className="space-y-4">
                    <div>
                      <Label>Surname</Label>
                      <Input {...register("familyData.mother.surname")} />
                    </div>
                    <div>
                      <Label>First Name</Label>
                      <Input {...register("familyData.mother.firstName")} />
                    </div>
                    <div>
                      <Label>Middle Name</Label>
                      <Input {...register("familyData.mother.middleName")} />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Children</h3>
                  <Button
                    type="button"
                    onClick={addChild}
                    size="sm"
                    variant="outline"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Child
                  </Button>
                </div>
                <div className="space-y-4">
                  {(formData.familyData?.children || []).map(
                    (child: any, index: number) => (
                      <Card key={index}>
                        <CardContent className="pt-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Full Name</Label>
                              <Input
                                {...register(
                                  `familyData.children.${index}.name` as const
                                )}
                              />
                            </div>
                            <div>
                              <Label>Date of Birth</Label>
                              <Input
                                type="date"
                                {...register(
                                  `familyData.children.${index}.birthDate` as const
                                )}
                              />
                            </div>
                            <div className="col-span-2 flex justify-end">
                              <Button
                                type="button"
                                onClick={() => removeChild(index)}
                                size="sm"
                                variant="destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Remove
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Educational Background Tab */}
        <TabsContent value="education" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Educational Background</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                "elementary",
                "secondary",
                "vocational",
                "college",
                "graduate",
              ].map((level) => (
                <div key={level}>
                  <h3 className="text-lg font-semibold mb-4 capitalize">
                    {level}
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Name of School</Label>
                      <Input
                        {...register(`educationalData.${level}.name` as const)}
                      />
                    </div>
                    <div>
                      <Label>Basic Education/Degree/Course</Label>
                      <Input
                        {...register(
                          `educationalData.${level}.basicEducation` as const
                        )}
                      />
                    </div>
                    <div>
                      <Label>Period From</Label>
                      <Input
                        type="date"
                        {...register(
                          `educationalData.${level}.periodFrom` as const
                        )}
                      />
                    </div>
                    <div>
                      <Label>Period To</Label>
                      <Input
                        type="date"
                        {...register(
                          `educationalData.${level}.periodTo` as const
                        )}
                      />
                    </div>
                    <div>
                      <Label>
                        Highest Level/Units Earned (if not graduated)
                      </Label>
                      <Input
                        {...register(
                          `educationalData.${level}.highestLevel` as const
                        )}
                      />
                    </div>
                    <div>
                      <Label>Year Graduated</Label>
                      <Input
                        {...register(
                          `educationalData.${level}.yearGraduated` as const
                        )}
                      />
                    </div>
                    <div className="col-span-2">
                      <Label>Scholarship/Academic Honors Received</Label>
                      <Input
                        {...register(
                          `educationalData.${level}.scholarship` as const
                        )}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Civil Service Eligibility Tab */}
        <TabsContent value="civil-service" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Civil Service Eligibility</CardTitle>
                <Button
                  type="button"
                  onClick={addEligibility}
                  size="sm"
                  variant="outline"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Eligibility
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {(formData.civilServiceData?.eligibility || []).map(
                (_: any, index: number) => (
                  <Card key={index}>
                    <CardContent className="pt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Label className="flex items-center gap-2">
                                Career Service
                                <Info className="w-4 h-4 text-muted-foreground cursor-pointer" />
                              </Label>
                            </TooltipTrigger>
                            <TooltipContent
                              side="top"
                              className="max-w-xs text-sm leading-snug"
                            >
                              RA 1080 (BOARD/ BAR) under Special Laws / CES /
                              CSEE / Barangay Eligibility / Driver's License
                            </TooltipContent>
                          </Tooltip>
                          <Input
                            {...register(
                              `civilServiceData.eligibility.${index}.careerService` as const
                            )}
                          />
                        </div>
                        <div>
                          <Label>Rating (If Applicable)</Label>
                          <Input
                            {...register(
                              `civilServiceData.eligibility.${index}.rating` as const
                            )}
                          />
                        </div>
                        <div>
                          <Label>Date of Examination / Conferment</Label>
                          <Input
                            type="date"
                            {...register(
                              `civilServiceData.eligibility.${index}.dateOfExamination` as const
                            )}
                          />
                        </div>
                        <div>
                          <Label>Place of Examination</Label>
                          <Input
                            {...register(
                              `civilServiceData.eligibility.${index}.placeOfExamination` as const
                            )}
                          />
                        </div>
                        <div>
                          <Label>License Number (If Applicable)</Label>
                          <Input
                            {...register(
                              `civilServiceData.eligibility.${index}.licenseNumber` as const
                            )}
                          />
                        </div>
                        <div>
                          <Label>Date of Validity (If Applicable)</Label>
                          <Input
                            type="date"
                            {...register(
                              `civilServiceData.eligibility.${index}.dateOfValidity` as const
                            )}
                          />
                        </div>
                        <div className="col-span-2 flex justify-end">
                          <Button
                            type="button"
                            onClick={() => removeEligibility(index)}
                            size="sm"
                            variant="destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Work Experience Tab */}
        <TabsContent value="work" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Work Experience</CardTitle>
                <Button
                  type="button"
                  onClick={addWorkExperience}
                  size="sm"
                  variant="outline"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Work Experience
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {(formData.workExperienceData?.workExperience || []).map(
                (_: any, index: number) => (
                  <Card key={index}>
                    <CardContent className="pt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>From</Label>
                          <Input
                            type="date"
                            {...register(
                              `workExperienceData.workExperience.${index}.from` as const
                            )}
                          />
                        </div>
                        <div>
                          <Label>To</Label>
                          <Input
                            type="date"
                            {...register(
                              `workExperienceData.workExperience.${index}.to` as const
                            )}
                          />
                        </div>
                        <div>
                          <Label>Position Title</Label>
                          <Input
                            {...register(
                              `workExperienceData.workExperience.${index}.positionTitle` as const
                            )}
                          />
                        </div>
                        <div>
                          <Label>Department/Agency</Label>
                          <Input
                            {...register(
                              `workExperienceData.workExperience.${index}.department` as const
                            )}
                          />
                        </div>
                        <div>
                          <Label>Monthly Salary</Label>
                          <Input
                            {...register(
                              `workExperienceData.workExperience.${index}.monthlySalary` as const
                            )}
                          />
                        </div>
                        <div>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Label className="flex items-center gap-2">
                                Salary Grade
                                <Info className="w-4 h-4 text-muted-foreground cursor-pointer" />
                              </Label>
                            </TooltipTrigger>
                            <TooltipContent
                              side="top"
                              className="max-w-xs text-sm leading-snug"
                            >
                              Salary / Job / Pay grade (if applicable) & STEP
                              (Format "00-0")/ From Increment
                            </TooltipContent>
                          </Tooltip>
                          <Input
                            {...register(
                              `workExperienceData.workExperience.${index}.salaryGrade` as const
                            )}
                          />
                        </div>

                        <div>
                          <Label>Status of Appointment</Label>
                          <Input
                            {...register(
                              `workExperienceData.workExperience.${index}.statusOfAppointment` as const
                            )}
                          />
                        </div>
                        <div>
                          <Label>Government Service</Label>
                          <Select
                            value={
                              formData.workExperienceData?.workExperience[index]
                                ?.governmentService === "Y"
                                ? "Yes"
                                : formData.workExperienceData?.workExperience[
                                    index
                                  ]?.governmentService === "N"
                                ? "No"
                                : "None"
                            }
                            onValueChange={(value) =>
                              setValue(
                                `workExperienceData.workExperience.${index}.governmentService` as const,
                                value === "Yes"
                                  ? "Y"
                                  : value === "No"
                                  ? "N"
                                  : ""
                              )
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select option" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="None">None</SelectItem>
                              <SelectItem value="Yes">Yes</SelectItem>
                              <SelectItem value="No">No</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="col-span-2 flex justify-end">
                          <Button
                            type="button"
                            onClick={() => removeWorkExperience(index)}
                            size="sm"
                            variant="destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Voluntary Work</CardTitle>
                <Button
                  type="button"
                  onClick={addVoluntaryWork}
                  size="sm"
                  variant="outline"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Voluntary Work
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {(formData.voluntaryWorkData?.voluntaryWork || []).map(
                (_: any, index: number) => (
                  <Card key={index}>
                    <CardContent className="pt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Name & Address of Organization</Label>
                          <Input
                            {...register(
                              `voluntaryWorkData.voluntaryWork.${index}.organization` as const
                            )}
                          />
                        </div>
                        <div>
                          <Label>Position / Nature of Work</Label>
                          <Input
                            {...register(
                              `voluntaryWorkData.voluntaryWork.${index}.position` as const
                            )}
                          />
                        </div>
                        <div>
                          <Label>Date From</Label>
                          <Input
                            type="date"
                            {...register(
                              `voluntaryWorkData.voluntaryWork.${index}.dateFrom` as const
                            )}
                          />
                        </div>
                        <div>
                          <Label>Date To</Label>
                          <Input
                            type="date"
                            {...register(
                              `voluntaryWorkData.voluntaryWork.${index}.dateTo` as const
                            )}
                          />
                        </div>
                        <div>
                          <Label>Number of Hours</Label>
                          <Input
                            {...register(
                              `voluntaryWorkData.voluntaryWork.${index}.numberOfHours` as const
                            )}
                          />
                        </div>
                        <div className="col-span-2 flex justify-end">
                          <Button
                            type="button"
                            onClick={() => removeVoluntaryWork(index)}
                            size="sm"
                            variant="destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Learning and Development</CardTitle>
                <Button
                  type="button"
                  onClick={addTrainingProgram}
                  size="sm"
                  variant="outline"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Training
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {(formData.trainingProgramsData?.trainingPrograms || []).map(
                (_: any, index: number) => (
                  <Card key={index}>
                    <CardContent className="pt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Title of Learning and Development</Label>
                          <Input
                            {...register(
                              `trainingProgramsData.trainingPrograms.${index}.title` as const
                            )}
                          />
                        </div>
                        <div>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Label className="flex items-center gap-2">
                                Type
                                <Info className="w-4 h-4 text-muted-foreground cursor-pointer" />
                              </Label>
                            </TooltipTrigger>
                            <TooltipContent
                              side="top"
                              className="max-w-xs text-sm leading-snug"
                            >
                              Managerial / Supervisory / Technical / etc.
                            </TooltipContent>
                          </Tooltip>
                          <Input
                            {...register(
                              `trainingProgramsData.trainingPrograms.${index}.type` as const
                            )}
                          />
                        </div>
                        <div>
                          <Label>Inclusive Dates From</Label>
                          <Input
                            type="date"
                            {...register(
                              `trainingProgramsData.trainingPrograms.${index}.inclusiveDatesFrom` as const
                            )}
                          />
                        </div>
                        <div>
                          <Label>Inclusive Dates To</Label>
                          <Input
                            type="date"
                            {...register(
                              `trainingProgramsData.trainingPrograms.${index}.inclusiveDatesTo` as const
                            )}
                          />
                        </div>
                        <div>
                          <Label>Number of Hours</Label>
                          <Input
                            {...register(
                              `trainingProgramsData.trainingPrograms.${index}.hours` as const
                            )}
                          />
                        </div>
                        <div>
                          <Label>Conducted/ Sponsored By</Label>
                          <Input
                            {...register(
                              `trainingProgramsData.trainingPrograms.${index}.conductedBy` as const
                            )}
                          />
                        </div>
                        <div className="col-span-2 flex justify-end">
                          <Button
                            type="button"
                            onClick={() => removeTrainingProgram(index)}
                            size="sm"
                            variant="destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Other Information Tab */}
        <TabsContent value="other" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Other Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Special Skills / Hobbies */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">
                    Special skills and Hobbies
                  </h3>
                  <Button
                    type="button"
                    onClick={addSkill}
                    size="sm"
                    variant="outline"
                    disabled={(formData.otherInfo?.skills || []).length >= 7}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Skill/Hobby
                  </Button>
                </div>
                <div className="space-y-2">
                  {(formData.otherInfo?.skills || []).map(
                    (_: any, index: number) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          placeholder="Enter special skill or hobby"
                          {...register(`otherInfo.skills.${index}` as const)}
                          className="flex-1"
                        />
                        {(formData.otherInfo?.skills || []).length > 1 && (
                          <Button
                            type="button"
                            onClick={() => removeSkill(index)}
                            size="sm"
                            variant="destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    )
                  )}
                  {(!formData.otherInfo?.skills ||
                    formData.otherInfo.skills.length === 0) && (
                    <p className="text-sm text-muted-foreground">
                      No skills/hobbies added yet.
                    </p>
                  )}
                </div>
              </div>

              {/* Non-Academic Distinctions / Recognition */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">
                    Non-Academic Distinctions / Recognitions
                  </h3>
                  <Button
                    type="button"
                    onClick={addNonAcad}
                    size="sm"
                    variant="outline"
                    disabled={(formData.otherInfo?.nonAcad || []).length >= 7}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Distinction/Recognition
                  </Button>
                </div>
                <div className="space-y-2">
                  {(formData.otherInfo?.nonAcad || []).map(
                    (_: any, index: number) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          placeholder="Enter non-academic distinction or recognition"
                          {...register(`otherInfo.nonAcad.${index}` as const)}
                          className="flex-1"
                        />
                        {(formData.otherInfo?.nonAcad || []).length > 1 && (
                          <Button
                            type="button"
                            onClick={() => removeNonAcad(index)}
                            size="sm"
                            variant="destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    )
                  )}
                  {(!formData.otherInfo?.nonAcad ||
                    formData.otherInfo.nonAcad.length === 0) && (
                    <p className="text-sm text-muted-foreground">
                      No distinctions/recognitions added yet.
                    </p>
                  )}
                </div>
              </div>

              {/* Membership in Association / Organization */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">
                    Membership in Association / Organization
                  </h3>
                  <Button
                    type="button"
                    onClick={addMember}
                    size="sm"
                    variant="outline"
                    disabled={(formData.otherInfo?.member || []).length >= 7}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Membership
                  </Button>
                </div>
                <div className="space-y-2">
                  {(formData.otherInfo?.member || []).map(
                    (_: any, index: number) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          placeholder="Enter association or organization"
                          {...register(`otherInfo.member.${index}` as const)}
                          className="flex-1"
                        />
                        {(formData.otherInfo?.member || []).length > 1 && (
                          <Button
                            type="button"
                            onClick={() => removeMember(index)}
                            size="sm"
                            variant="destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    )
                  )}
                  {(!formData.otherInfo?.member ||
                    formData.otherInfo.member.length === 0) && (
                    <p className="text-sm text-muted-foreground">
                      No memberships added yet.
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Disclosures Tab */}
        <TabsContent value="disclosures" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>
                Disclosure of Legal, Political, and Social Affiliations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Card>
                <CardContent className="pt-4 space-y-4">
                  <div>
                    <Label className="text-base mb-2 block">
                      Are you related by consanguinity or affinity to the
                      appointing/recommending authority, chief of bureau/office,
                      or immediate supervisor in the office where you will be
                      appointed?
                    </Label>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-normal mb-2 block">
                          a. within the third degree?
                        </Label>
                        <RadioGroup
                          value={formData.lastpData?.answers?.[0]?.value || ""}
                          onValueChange={(value) =>
                            setValue(
                              "lastpData.answers.0.value",
                              value === "Yes" ? "Yes" : "No"
                            )
                          }
                          className="flex flex-row gap-6"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Yes" id="q34a-yes" />
                            <Label
                              htmlFor="q34a-yes"
                              className="font-normal cursor-pointer"
                            >
                              Yes
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="No" id="q34a-no" />
                            <Label
                              htmlFor="q34a-no"
                              className="font-normal cursor-pointer"
                            >
                              No
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>
                      <div>
                        <Label className="text-sm font-normal mb-2 block">
                          b. within the fourth degree (for Local Government Unit
                          - Career Employees)?
                        </Label>
                        <RadioGroup
                          value={formData.lastpData?.answers?.[1]?.value || ""}
                          onValueChange={(value) =>
                            setValue(
                              "lastpData.answers.1.value",
                              value === "Yes" ? "Yes" : "No"
                            )
                          }
                          className="flex flex-row gap-6"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Yes" id="q34b-yes" />
                            <Label
                              htmlFor="q34b-yes"
                              className="font-normal cursor-pointer"
                            >
                              Yes
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="No" id="q34b-no" />
                            <Label
                              htmlFor="q34b-no"
                              className="font-normal cursor-pointer"
                            >
                              No
                            </Label>
                          </div>
                        </RadioGroup>
                        {formData.lastpData?.answers?.[1]?.value === "Yes" && (
                          <div className="mt-2">
                            <Label>If YES, give details:</Label>
                            <Input
                              {...register("lastpData.answers.1.details")}
                              placeholder="Enter details"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Administrative and Criminal Charges</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-base mb-2 block">
                      a. Have you ever been found guilty of any administrative
                      offense?
                    </Label>
                    <RadioGroup
                      value={formData.lastpData?.answers?.[2]?.value || ""}
                      onValueChange={(value) =>
                        setValue(
                          "lastpData.answers.2.value",
                          value === "Yes" ? "Yes" : "No"
                        )
                      }
                      className="flex flex-row gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Yes" id="q35a-yes" />
                        <Label
                          htmlFor="q35a-yes"
                          className="font-normal cursor-pointer"
                        >
                          Yes
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="No" id="q35a-no" />
                        <Label
                          htmlFor="q35a-no"
                          className="font-normal cursor-pointer"
                        >
                          No
                        </Label>
                      </div>
                    </RadioGroup>
                    {formData.lastpData?.answers?.[2]?.value === "Yes" && (
                      <div className="mt-2">
                        <Label>If YES, give details:</Label>
                        <Input
                          {...register("lastpData.answers.2.details")}
                          placeholder="Enter details"
                        />
                      </div>
                    )}
                  </div>
                  <div>
                    <Label className="text-base mb-2 block">
                      b. Have you been criminally charged before any court?
                    </Label>
                    <RadioGroup
                      value={formData.lastpData?.answers?.[3]?.value || ""}
                      onValueChange={(value) =>
                        setValue(
                          "lastpData.answers.3.value",
                          value === "Yes" ? "Yes" : "No"
                        )
                      }
                      className="flex flex-row gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Yes" id="q35b-yes" />
                        <Label
                          htmlFor="q35b-yes"
                          className="font-normal cursor-pointer"
                        >
                          Yes
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="No" id="q35b-no" />
                        <Label
                          htmlFor="q35b-no"
                          className="font-normal cursor-pointer"
                        >
                          No
                        </Label>
                      </div>
                    </RadioGroup>
                    {formData.lastpData?.answers?.[3]?.value === "Yes" && (
                      <div className="mt-2 space-y-2">
                        <div>
                          <Label>If YES, give details:</Label>
                          <Input
                            {...register("lastpData.answers.3.details")}
                            placeholder="Enter details"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Date Filed:</Label>
                            <Input
                              type="date"
                              {...register("lastpData.answers.3.dateFiled")}
                            />
                          </div>
                          <div>
                            <Label>Status of Case/s:</Label>
                            <Input
                              {...register("lastpData.answers.3.status")}
                              placeholder="Enter status"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Conviction of Crime/Violation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <Label className="text-base mb-2 block">
                      Have you ever been convicted of any crime or violation of
                      any law, decree, ordinance, or regulation by any court or
                      tribunal?
                    </Label>
                    <RadioGroup
                      value={formData.lastpData?.answers?.[4]?.value || ""}
                      onValueChange={(value) =>
                        setValue(
                          "lastpData.answers.4.value",
                          value === "Yes" ? "Yes" : "No"
                        )
                      }
                      className="flex flex-row gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Yes" id="q36-yes" />
                        <Label
                          htmlFor="q36-yes"
                          className="font-normal cursor-pointer"
                        >
                          Yes
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="No" id="q36-no" />
                        <Label
                          htmlFor="q36-no"
                          className="font-normal cursor-pointer"
                        >
                          No
                        </Label>
                      </div>
                    </RadioGroup>
                    {formData.lastpData?.answers?.[4]?.value === "Yes" && (
                      <div className="mt-2">
                        <Label>If YES, give details:</Label>
                        <Input
                          {...register("lastpData.answers.4.details")}
                          placeholder="Enter details"
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Separation from Service</CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <Label className="text-base mb-2 block">
                      Have you ever been separated from the service in any of
                      the following modes: resignation, retirement, dropped from
                      the rolls, dismissal, termination, end of term, finished
                      contract or phased out, abolition, lay-off, retrenchment,
                      or any other mode of separation from the service?
                    </Label>
                    <RadioGroup
                      value={formData.lastpData?.answers?.[5]?.value || ""}
                      onValueChange={(value) =>
                        setValue(
                          "lastpData.answers.5.value",
                          value === "Yes" ? "Yes" : "No"
                        )
                      }
                      className="flex flex-row gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Yes" id="q37-yes" />
                        <Label
                          htmlFor="q37-yes"
                          className="font-normal cursor-pointer"
                        >
                          Yes
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="No" id="q37-no" />
                        <Label
                          htmlFor="q37-no"
                          className="font-normal cursor-pointer"
                        >
                          No
                        </Label>
                      </div>
                    </RadioGroup>
                    {formData.lastpData?.answers?.[5]?.value === "Yes" && (
                      <div className="mt-2">
                        <Label>If YES, give details:</Label>
                        <Input
                          {...register("lastpData.answers.5.details")}
                          placeholder="Enter details"
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Political Involvement</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-base mb-2 block">
                      a. Have you ever been a candidate in a national or local
                      election held within the last year (except Barangay
                      election)?
                    </Label>
                    <RadioGroup
                      value={formData.lastpData?.answers?.[6]?.value || ""}
                      onValueChange={(value) =>
                        setValue(
                          "lastpData.answers.6.value",
                          value === "Yes" ? "Yes" : "No"
                        )
                      }
                      className="flex flex-row gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Yes" id="q38a-yes" />
                        <Label
                          htmlFor="q38a-yes"
                          className="font-normal cursor-pointer"
                        >
                          Yes
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="No" id="q38a-no" />
                        <Label
                          htmlFor="q38a-no"
                          className="font-normal cursor-pointer"
                        >
                          No
                        </Label>
                      </div>
                    </RadioGroup>
                    {formData.lastpData?.answers?.[6]?.value === "Yes" && (
                      <div className="mt-2">
                        <Label>If YES, give details:</Label>
                        <Input
                          {...register("lastpData.answers.6.details")}
                          placeholder="Enter details"
                        />
                      </div>
                    )}
                  </div>
                  <div>
                    <Label className="text-base mb-2 block">
                      b. Have you resigned from the government service during
                      the three (3)-month period before the last election to
                      promote/actively campaign for a national or local
                      candidate?
                    </Label>
                    <RadioGroup
                      value={formData.lastpData?.answers?.[7]?.value || ""}
                      onValueChange={(value) =>
                        setValue(
                          "lastpData.answers.7.value",
                          value === "Yes" ? "Yes" : "No"
                        )
                      }
                      className="flex flex-row gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Yes" id="q38b-yes" />
                        <Label
                          htmlFor="q38b-yes"
                          className="font-normal cursor-pointer"
                        >
                          Yes
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="No" id="q38b-no" />
                        <Label
                          htmlFor="q38b-no"
                          className="font-normal cursor-pointer"
                        >
                          No
                        </Label>
                      </div>
                    </RadioGroup>
                    {formData.lastpData?.answers?.[7]?.value === "Yes" && (
                      <div className="mt-2">
                        <Label>If YES, give details:</Label>
                        <Input
                          {...register("lastpData.answers.7.details")}
                          placeholder="Enter details"
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Immigrant/Permanent Resident Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <Label className="text-base mb-2 block">
                      Have you acquired the status of an immigrant or permanent
                      resident of another country?
                    </Label>
                    <RadioGroup
                      value={formData.lastpData?.answers?.[8]?.value || ""}
                      onValueChange={(value) =>
                        setValue(
                          "lastpData.answers.8.value",
                          value === "Yes" ? "Yes" : "No"
                        )
                      }
                      className="flex flex-row gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Yes" id="q39-yes" />
                        <Label
                          htmlFor="q39-yes"
                          className="font-normal cursor-pointer"
                        >
                          Yes
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="No" id="q39-no" />
                        <Label
                          htmlFor="q39-no"
                          className="font-normal cursor-pointer"
                        >
                          No
                        </Label>
                      </div>
                    </RadioGroup>
                    {formData.lastpData?.answers?.[8]?.value === "Yes" && (
                      <div className="mt-2">
                        <Label>If YES, give details (country):</Label>
                        <Input
                          {...register("lastpData.answers.8.details")}
                          placeholder="Enter country"
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>
                    Special Classifications (Pursuant to RA 8371, RA 7277, and
                    RA 8972)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-base mb-2 block">
                      a. Are you a member of any indigenous group?
                    </Label>
                    <RadioGroup
                      value={formData.lastpData?.answers?.[9]?.value || ""}
                      onValueChange={(value) =>
                        setValue(
                          "lastpData.answers.9.value",
                          value === "Yes" ? "Yes" : "No"
                        )
                      }
                      className="flex flex-row gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Yes" id="q40a-yes" />
                        <Label
                          htmlFor="q40a-yes"
                          className="font-normal cursor-pointer"
                        >
                          Yes
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="No" id="q40a-no" />
                        <Label
                          htmlFor="q40a-no"
                          className="font-normal cursor-pointer"
                        >
                          No
                        </Label>
                      </div>
                    </RadioGroup>
                    {formData.lastpData?.answers?.[9]?.value === "Yes" && (
                      <div className="mt-2">
                        <Label>If YES, please specify:</Label>
                        <Input
                          {...register("lastpData.answers.9.details")}
                          placeholder="Enter specification"
                        />
                      </div>
                    )}
                  </div>
                  <div>
                    <Label className="text-base mb-2 block">
                      b. Are you a person with disability?
                    </Label>
                    <RadioGroup
                      value={formData.lastpData?.answers?.[10]?.value || ""}
                      onValueChange={(value) =>
                        setValue(
                          "lastpData.answers.10.value",
                          value === "Yes" ? "Yes" : "No"
                        )
                      }
                      className="flex flex-row gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Yes" id="q40b-yes" />
                        <Label
                          htmlFor="q40b-yes"
                          className="font-normal cursor-pointer"
                        >
                          Yes
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="No" id="q40b-no" />
                        <Label
                          htmlFor="q40b-no"
                          className="font-normal cursor-pointer"
                        >
                          No
                        </Label>
                      </div>
                    </RadioGroup>
                    {formData.lastpData?.answers?.[10]?.value === "Yes" && (
                      <div className="mt-2">
                        <Label>If YES, please specify ID No:</Label>
                        <Input
                          {...register("lastpData.answers.10.details")}
                          placeholder="Enter ID No"
                        />
                      </div>
                    )}
                  </div>
                  <div>
                    <Label className="text-base mb-2 block">
                      c. Are you a solo parent?
                    </Label>
                    <RadioGroup
                      value={formData.lastpData?.answers?.[11]?.value || ""}
                      onValueChange={(value) =>
                        setValue(
                          "lastpData.answers.11.value",
                          value === "Yes" ? "Yes" : "No"
                        )
                      }
                      className="flex flex-row gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Yes" id="q40c-yes" />
                        <Label
                          htmlFor="q40c-yes"
                          className="font-normal cursor-pointer"
                        >
                          Yes
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="No" id="q40c-no" />
                        <Label
                          htmlFor="q40c-no"
                          className="font-normal cursor-pointer"
                        >
                          No
                        </Label>
                      </div>
                    </RadioGroup>
                    {formData.lastpData?.answers?.[11]?.value === "Yes" && (
                      <div className="mt-2">
                        <Label>If YES, please specify ID No:</Label>
                        <Input
                          {...register("lastpData.answers.11.details")}
                          placeholder="Enter ID No"
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        {/* References Tab */}
        <TabsContent value="references" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>References</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                {(formData.lastpData?.references || []).length < 3 && (
                  <Button
                    type="button"
                    onClick={addReference}
                    size="sm"
                    variant="outline"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Reference
                  </Button>
                )}
              </div>
              {(
                formData.lastpData?.references || [
                  { name: "", address: "", tel: "" },
                ]
              ).map((_: any, index: number) => (
                <Card key={index} className="mb-4">
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Full Name</Label>
                        <Input
                          {...register(
                            `lastpData.references.${index}.name` as const
                          )}
                        />
                      </div>
                      <div>
                        <Label>Address (City & Province)</Label>
                        <Input
                          {...register(
                            `lastpData.references.${index}.address` as const
                          )}
                        />
                      </div>
                      <div>
                        <Label>Telephone Number</Label>
                        <Input
                          {...register(
                            `lastpData.references.${index}.tel` as const
                          )}
                        />
                      </div>
                      {(formData.lastpData?.references || []).length > 1 && (
                        <div className="col-span-2 flex justify-end">
                          <Button
                            type="button"
                            onClick={() => removeReference(index)}
                            size="sm"
                            variant="destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Declaration Tab */}
        <TabsContent value="declaration" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Declaration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4 text-sm leading-relaxed">
                <p>
                  I declare that I have personally accomplished this Personal
                  Data Sheet which is a true, correct and complete statement
                  pursuant to the provisions of pertinent laws, rules and
                  regulations of the Republic of the Philippines. I understand
                  that any misrepresentation made in this document and its
                  attachments shall cause the disqualification of my application
                  and/or the forfeiture of my right to be appointed or continued
                  in the service.
                </p>
                <p>
                  I further declare that I am allowing the Civil Service
                  Commission to use my biometric data, which shall include my
                  finger scan, and facial image, to capture and store in its
                  database for purposes of authenticating my identity in the
                  conduct of the C.S.E.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Government Issued ID</Label>
                  <Input {...register("lastpData.declaration.issuedId")} />
                </div>
                <div>
                  <Label>ID/License/Passport No.</Label>
                  <Input {...register("lastpData.declaration.adminOath")} />
                </div>
                <div>
                  <Label>Date/Place of Issuance</Label>
                  <Input
                    {...register("lastpData.declaration.datePlaceOfIssuance")}
                  />
                </div>
                <div>
                  <Label>Date Accomplished</Label>
                  <Input
                    type="date"
                    {...register("lastpData.declaration.dateAccomplished")}
                  />
                </div>
                <div>
                  <Label>Person Administering Oath</Label>
                  <Input {...register("lastpData.declaration.place")} />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-4 border-t">
                <Checkbox
                  id="declaration-checkbox"
                  checked={formData.lastpData?.declarationChecked || false}
                  onCheckedChange={(checked) =>
                    setValue("lastpData.declarationChecked", checked === true)
                  }
                />
                <Label
                  htmlFor="declaration-checkbox"
                  className="text-sm font-normal cursor-pointer"
                >
                  I have read and agree to the declaration above.
                </Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-4 pt-6 border-t">
        <Button type="submit" disabled={isLoading}>
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? "Saving..." : "Save PDS"}
        </Button>
      </div>
    </form>
  );
}
