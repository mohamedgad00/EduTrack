"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  BookOpen,
  Briefcase,
  GraduationCap,
  Home,
  Key,
  User,
  UserCircle,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { z } from "zod";
import { AppDispatch, RootState } from "@/redux/store";
import { clearCreateUserState, createUser } from "@/redux/features/users/usersSlice";
import { showToast } from "@/utils/toastUtils";

type Role = "student" | "teacher" | "parent";

const formSchema = z
  .object({
    role: z.enum(["student", "teacher", "parent"], {
      message: "Please select a user type first",
    }).optional(),
    fullName: z.string().min(1, "This field is required"),
    email: z.string().min(1, "This field is required").email("Please enter a valid email"),
    phone: z.string().min(1, "This field is required"),
    gender: z.string().min(1, "Please select a gender"),
    dob: z.string().min(1, "This field is required"),
    profilePicture: z.any().optional(),
    username: z.string().min(1, "This field is required"),
    password: z.string().min(1, "This field is required"),
    grade: z.string().optional(),
    classSection: z.string().optional(),
    parentGuardian: z.string().optional(),
    enrollmentDate: z.string().optional(),
    specialty: z.string().optional(),
    experience: z.string().optional(),
    coursesAssigned: z.array(z.string()).default([]),
    hireDate: z.string().optional(),
    linkedStudents: z.array(z.string()).default([]),
    emergencyContact: z.string().optional(),
    address: z.string().optional(),
    sendWelcomeEmail: z.boolean().default(true),
  })
  .superRefine((data, context) => {
    if (!data.role) {
      context.addIssue({ code: "custom", path: ["role"], message: "Please select a user type first" });
      return;
    }

    if (data.role === "student") {
      if (!data.grade) {
        context.addIssue({ code: "custom", path: ["grade"], message: "This field is required" });
      }
      if (!data.classSection) {
        context.addIssue({ code: "custom", path: ["classSection"], message: "This field is required" });
      }
      if (!data.parentGuardian) {
        context.addIssue({ code: "custom", path: ["parentGuardian"], message: "This field is required" });
      }
      if (!data.enrollmentDate) {
        context.addIssue({ code: "custom", path: ["enrollmentDate"], message: "This field is required" });
      }
    }

    if (data.role === "teacher") {
      if (!data.specialty) {
        context.addIssue({ code: "custom", path: ["specialty"], message: "This field is required" });
      }
      if (!data.experience) {
        context.addIssue({ code: "custom", path: ["experience"], message: "This field is required" });
      }
      if (data.coursesAssigned.length === 0) {
        context.addIssue({ code: "custom", path: ["coursesAssigned"], message: "This field is required" });
      }
      if (!data.hireDate) {
        context.addIssue({ code: "custom", path: ["hireDate"], message: "This field is required" });
      }
    }

    if (data.role === "parent") {
      if (data.linkedStudents.length === 0) {
        context.addIssue({ code: "custom", path: ["linkedStudents"], message: "This field is required" });
      }
      if (!data.emergencyContact) {
        context.addIssue({ code: "custom", path: ["emergencyContact"], message: "This field is required" });
      }
      if (!data.address) {
        context.addIssue({ code: "custom", path: ["address"], message: "This field is required" });
      }
    }
  });

type FormValues = z.input<typeof formSchema>;

const defaultValues = {
  role: undefined,
  fullName: "",
  email: "",
  phone: "",
  gender: "",
  dob: "",
  profilePicture: undefined,
  username: "",
  password: "",
  grade: "",
  classSection: "",
  parentGuardian: "",
  enrollmentDate: "",
  specialty: "",
  experience: "",
  coursesAssigned: [] as string[],
  hireDate: "",
  linkedStudents: [] as string[],
  emergencyContact: "",
  address: "",
  sendWelcomeEmail: true,
} satisfies FormValues;

const roleCards: Array<{
  role: Role;
  title: string;
  description: string;
  icon: typeof User | typeof BookOpen | typeof Users;
  iconColor: string;
  iconBg: string;
}> = [
    {
      role: "student",
      title: "Student",
      description: "Create a student account",
      icon: User,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-100 group-hover:bg-blue-500",
    },
    {
      role: "teacher",
      title: "Teacher",
      description: "Create a teacher account",
      icon: BookOpen,
      iconColor: "text-teal-600",
      iconBg: "bg-teal-100 group-hover:bg-teal-500",
    },
    {
      role: "parent",
      title: "Parent",
      description: "Create a parent account",
      icon: Users,
      iconColor: "text-green-600",
      iconBg: "bg-green-100 group-hover:bg-green-500",
    },
  ];

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddUserModal({ isOpen, onClose }: AddUserModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { isCreating } = useSelector((state: RootState) => state.users);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const selectedRole = useWatch({ control, name: "role" });
  const visibleRoleFields = selectedRole ?? null;

  const closeModal = () => {
    reset(defaultValues);
    dispatch(clearCreateUserState());
    onClose();
  };

  const handleRoleSelect = (role: Role) => {
    setValue("role", role, { shouldValidate: true, shouldDirty: true });
  };

  const resetForm = () => {
    const confirmed = window.confirm("Are you sure you want to cancel? All entered data will be lost.");
    if (!confirmed) return;

    closeModal();
  };

  const onSubmit = async (data: FormValues) => {
    if (!data.role) return;

    const payload = {
      role: data.role,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      gender: data.gender,
      dob: data.dob,
      username: data.username,
      password: data.password,
      sendWelcomeEmail: data.sendWelcomeEmail ?? true,
      ...(data.role === "student"
        ? {
          grade: data.grade,
          classSection: data.classSection,
          parentGuardian: data.parentGuardian,
          enrollmentDate: data.enrollmentDate,
        }
        : {}),
      ...(data.role === "teacher"
        ? {
          specialty: data.specialty,
          experience: data.experience,
          coursesAssigned: data.coursesAssigned,
          hireDate: data.hireDate,
        }
        : {}),
      ...(data.role === "parent"
        ? {
          linkedStudents: data.linkedStudents,
          emergencyContact: data.emergencyContact,
          address: data.address,
        }
        : {}),
    };

    dispatch(clearCreateUserState());
    const action = await dispatch(createUser(payload));
    if (createUser.fulfilled.match(action)) {
      showToast("success", "User created successfully.");
      reset(defaultValues);
      return;
    }

    if (createUser.rejected.match(action)) {
      const errorMessage = (action.payload as string) ?? "Failed to create user. Please try again.";
      showToast("error", errorMessage);
    }
  };

  const inputClass = (hasError: boolean) =>
    [
      "w-full rounded-[var(--radius-small)] border px-4 py-3 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500",
      hasError ? "border-red-500" : "border-gray-300",
    ].join(" ");

  if (!isOpen) {
    return null;
  }

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 p-8 text-gray-900" style={{ fontFamily: "var(--font-body)" }}>
      <main className="mx-auto max-w-6xl py-4">
        <header className="rounded-(--radius-large) border-b border-gray-200 bg-white px-8 py-4 shadow-(--shadow-custom)">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="font-heading text-2xl font-bold text-gray-900">Add New User</h2>
              <p className="mt-1 text-sm text-gray-600">Create a student, teacher, or parent account</p>
            </div>
            <button
              type="button"
              onClick={closeModal}
              className="flex items-center gap-2 rounded-(--radius-small) px-4 py-2 text-gray-700 transition-colors hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
              <span className="font-medium">Close</span>
            </button>
          </div>
        </header>

        <div className="py-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <input type="hidden" {...register("role")} />

            <div className="rounded-(--radius-large) bg-white p-6 shadow-(--shadow-custom)">
              <h3 className="mb-4 font-heading text-lg font-semibold text-gray-900">Select User Type</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {roleCards.map(({ role, title, description, icon: Icon, iconColor, iconBg }) => {
                  const isActive = selectedRole === role;
                  return (
                    <button
                      key={role}
                      type="button"
                      onClick={() => handleRoleSelect(role)}
                      className={[
                        "group flex flex-col items-center justify-center rounded-(--radius-large) border-2 p-6 transition-all hover:border-blue-500 hover:bg-blue-50",
                        isActive ? "border-blue-500 bg-blue-50" : "border-gray-200",
                      ].join(" ")}
                    >
                      <div
                        className={[
                          "mb-3 flex h-16 w-16 items-center justify-center rounded-full transition-colors",
                          iconBg,
                        ].join(" ")}
                      >
                        <Icon className={["h-8 w-8 transition-colors group-hover:text-white", iconColor].join(" ")} />
                      </div>
                      <h4 className="mb-1 font-heading font-semibold text-gray-900">{title}</h4>
                      <p className="text-center text-sm text-gray-600">{description}</p>
                    </button>
                  );
                })}
              </div>
              {errors.role?.message ? <p className="mt-3 text-sm text-red-500">{errors.role.message}</p> : null}
            </div>

            {visibleRoleFields ? (
              <div className="space-y-6">
                <section className="rounded-(--radius-large) bg-white p-6 shadow-(--shadow-custom)">
                  <div className="mb-6 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                      <UserCircle className="h-5 w-5 text-blue-600" />
                    </div>
                    <h3 className="font-heading text-lg font-semibold text-gray-900">Basic Information</h3>
                  </div>

                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <div className="space-y-4">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          {...register("fullName")}
                          className={inputClass(Boolean(errors.fullName))}
                          placeholder="Enter full name"
                        />
                        {errors.fullName?.message ? (
                          <span className="mt-1 text-sm text-red-500">{errors.fullName.message}</span>
                        ) : null}
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          {...register("email")}
                          className={inputClass(Boolean(errors.email))}
                          placeholder="email@example.com"
                        />
                        {errors.email?.message ? <span className="mt-1 text-sm text-red-500">{errors.email.message}</span> : null}
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Phone Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          {...register("phone")}
                          className={inputClass(Boolean(errors.phone))}
                          placeholder="+1 (555) 000-0000"
                        />
                        {errors.phone?.message ? <span className="mt-1 text-sm text-red-500">{errors.phone.message}</span> : null}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Gender <span className="text-red-500">*</span>
                        </label>
                        <select {...register("gender")} className={inputClass(Boolean(errors.gender))}>
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                        {errors.gender?.message ? <span className="mt-1 text-sm text-red-500">{errors.gender.message}</span> : null}
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Date of Birth <span className="text-red-500">*</span>
                        </label>
                        <input type="date" {...register("dob")} className={inputClass(Boolean(errors.dob))} />
                        {errors.dob?.message ? <span className="mt-1 text-sm text-red-500">{errors.dob.message}</span> : null}
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">Profile Picture</label>
                        <input
                          type="file"
                          accept="image/*"
                          {...register("profilePicture")}
                          className="w-full rounded-(--radius-small) border border-gray-300 px-4 py-3 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </section>

                {visibleRoleFields === "student" ? (
                  <section className="rounded-(--radius-large) bg-white p-6 shadow-(--shadow-custom)">
                    <div className="mb-6 flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                        <GraduationCap className="h-5 w-5 text-blue-600" />
                      </div>
                      <h3 className="font-heading text-lg font-semibold text-gray-900">Student Details</h3>
                    </div>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                      <div className="space-y-4">
                        <div>
                          <label className="mb-2 block text-sm font-medium text-gray-700">
                            Grade / Level <span className="text-red-500">*</span>
                          </label>
                          <select {...register("grade")} className={inputClass(Boolean(errors.grade))}>
                            <option value="">Select Grade</option>
                            <option value="1">Grade 1</option>
                            <option value="2">Grade 2</option>
                            <option value="3">Grade 3</option>
                            <option value="4">Grade 4</option>
                            <option value="5">Grade 5</option>
                            <option value="6">Grade 6</option>
                            <option value="7">Grade 7</option>
                            <option value="8">Grade 8</option>
                            <option value="9">Grade 9</option>
                            <option value="10">Grade 10</option>
                            <option value="11">Grade 11</option>
                            <option value="12">Grade 12</option>
                          </select>
                          {errors.grade?.message ? <span className="mt-1 text-sm text-red-500">{errors.grade.message}</span> : null}
                        </div>
                        <div>
                          <label className="mb-2 block text-sm font-medium text-gray-700">
                            Class / Section <span className="text-red-500">*</span>
                          </label>
                          <select {...register("classSection")} className={inputClass(Boolean(errors.classSection))}>
                            <option value="">Select Class</option>
                            <option value="A">Section A</option>
                            <option value="B">Section B</option>
                            <option value="C">Section C</option>
                            <option value="D">Section D</option>
                          </select>
                          {errors.classSection?.message ? (
                            <span className="mt-1 text-sm text-red-500">{errors.classSection.message}</span>
                          ) : null}
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="mb-2 block text-sm font-medium text-gray-700">
                            Parent / Guardian <span className="text-red-500">*</span>
                          </label>
                          <select {...register("parentGuardian")} className={inputClass(Boolean(errors.parentGuardian))}>
                            <option value="">Select Parent</option>
                            <option value="1">John Smith (Father)</option>
                            <option value="2">Mary Johnson (Mother)</option>
                            <option value="3">Robert Williams (Guardian)</option>
                          </select>
                          {errors.parentGuardian?.message ? (
                            <span className="mt-1 text-sm text-red-500">{errors.parentGuardian.message}</span>
                          ) : null}
                        </div>
                        <div>
                          <label className="mb-2 block text-sm font-medium text-gray-700">
                            Enrollment Date <span className="text-red-500">*</span>
                          </label>
                          <input type="date" {...register("enrollmentDate")} className={inputClass(Boolean(errors.enrollmentDate))} />
                          {errors.enrollmentDate?.message ? (
                            <span className="mt-1 text-sm text-red-500">{errors.enrollmentDate.message}</span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </section>
                ) : null}

                {visibleRoleFields === "teacher" ? (
                  <section className="rounded-(--radius-large) bg-white p-6 shadow-(--shadow-custom)">
                    <div className="mb-6 flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-100">
                        <Briefcase className="h-5 w-5 text-teal-600" />
                      </div>
                      <h3 className="font-heading text-lg font-semibold text-gray-900">Teacher Details</h3>
                    </div>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                      <div className="space-y-4">
                        <div>
                          <label className="mb-2 block text-sm font-medium text-gray-700">
                            Specialty / Subject <span className="text-red-500">*</span>
                          </label>
                          <select {...register("specialty")} className={inputClass(Boolean(errors.specialty))}>
                            <option value="">Select Subject</option>
                            <option value="math">Mathematics</option>
                            <option value="science">Science</option>
                            <option value="english">English</option>
                            <option value="history">History</option>
                            <option value="arts">Arts</option>
                            <option value="pe">Physical Education</option>
                          </select>
                          {errors.specialty?.message ? <span className="mt-1 text-sm text-red-500">{errors.specialty.message}</span> : null}
                        </div>
                        <div>
                          <label className="mb-2 block text-sm font-medium text-gray-700">
                            Years of Experience <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            min={0}
                            {...register("experience")}
                            className={inputClass(Boolean(errors.experience))}
                            placeholder="5"
                          />
                          {errors.experience?.message ? <span className="mt-1 text-sm text-red-500">{errors.experience.message}</span> : null}
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="mb-2 block text-sm font-medium text-gray-700">
                            Courses Assigned <span className="text-red-500">*</span>
                          </label>
                          <select
                            multiple
                            {...register("coursesAssigned")}
                            className="h-24 w-full rounded-(--radius-small) border border-gray-300 px-4 py-3 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="1">Mathematics - Grade 10</option>
                            <option value="2">Algebra - Grade 9</option>
                            <option value="3">Calculus - Grade 12</option>
                            <option value="4">Geometry - Grade 11</option>
                          </select>
                          {errors.coursesAssigned?.message ? (
                            <span className="mt-1 text-sm text-red-500">{errors.coursesAssigned.message}</span>
                          ) : null}
                          <p className="mt-1 text-xs text-gray-500">Hold Ctrl/Cmd to select multiple</p>
                        </div>
                        <div>
                          <label className="mb-2 block text-sm font-medium text-gray-700">
                            Hire Date <span className="text-red-500">*</span>
                          </label>
                          <input type="date" {...register("hireDate")} className={inputClass(Boolean(errors.hireDate))} />
                          {errors.hireDate?.message ? <span className="mt-1 text-sm text-red-500">{errors.hireDate.message}</span> : null}
                        </div>
                      </div>
                    </div>
                  </section>
                ) : null}

                {visibleRoleFields === "parent" ? (
                  <section className="rounded-(--radius-large) bg-white p-6 shadow-(--shadow-custom)">
                    <div className="mb-6 flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                        <Home className="h-5 w-5 text-green-600" />
                      </div>
                      <h3 className="font-heading text-lg font-semibold text-gray-900">Parent Details</h3>
                    </div>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                      <div className="space-y-4">
                        <div>
                          <label className="mb-2 block text-sm font-medium text-gray-700">
                            Linked Students <span className="text-red-500">*</span>
                          </label>
                          <select
                            multiple
                            {...register("linkedStudents")}
                            className="h-32 w-full rounded-(--radius-small) border border-gray-300 px-4 py-3 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="1">Emma Johnson - Grade 5A</option>
                            <option value="2">Liam Johnson - Grade 3B</option>
                            <option value="3">Olivia Smith - Grade 7C</option>
                            <option value="4">Noah Williams - Grade 9A</option>
                          </select>
                          {errors.linkedStudents?.message ? (
                            <span className="mt-1 text-sm text-red-500">{errors.linkedStudents.message}</span>
                          ) : null}
                          <p className="mt-1 text-xs text-gray-500">Hold Ctrl/Cmd to select multiple children</p>
                        </div>
                        <div>
                          <label className="mb-2 block text-sm font-medium text-gray-700">
                            Emergency Contact Number <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="tel"
                            {...register("emergencyContact")}
                            className={inputClass(Boolean(errors.emergencyContact))}
                            placeholder="+1 (555) 000-0000"
                          />
                          {errors.emergencyContact?.message ? (
                            <span className="mt-1 text-sm text-red-500">{errors.emergencyContact.message}</span>
                          ) : null}
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="mb-2 block text-sm font-medium text-gray-700">
                            Address <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            rows={4}
                            {...register("address")}
                            className={`${inputClass(Boolean(errors.address))} resize-none`}
                            placeholder="Enter full address"
                          />
                          {errors.address?.message ? <span className="mt-1 text-sm text-red-500">{errors.address.message}</span> : null}
                        </div>
                      </div>
                    </div>
                  </section>
                ) : null}

                <section className="rounded-(--radius-large) bg-white p-6 shadow-(--shadow-custom)">
                  <div className="mb-6 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100">
                      <Key className="h-5 w-5 text-purple-600" />
                    </div>
                    <h3 className="font-heading text-lg font-semibold text-gray-900">Account Settings</h3>
                  </div>

                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Username <span className="text-red-500">*</span>
                      </label>
                      <input type="text" {...register("username")} className={inputClass(Boolean(errors.username))} placeholder="username" />
                      {errors.username?.message ? <span className="mt-1 text-sm text-red-500">{errors.username.message}</span> : null}
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Temporary Password <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        {...register("password")}
                        className={inputClass(Boolean(errors.password))}
                        placeholder="••••••••"
                      />
                      {errors.password?.message ? <span className="mt-1 text-sm text-red-500">{errors.password.message}</span> : null}
                    </div>
                  </div>

                  <div className="mt-6 rounded-(--radius-small) border border-blue-200 bg-blue-50 p-4">
                    <label className="flex cursor-pointer items-start gap-3">
                      <input
                        type="checkbox"
                        {...register("sendWelcomeEmail")}
                        className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <span className="text-sm font-medium text-gray-900">Send welcome email with login credentials</span>
                        <p className="mt-1 text-xs text-gray-600">User will receive an email with their username and temporary password</p>
                      </div>
                    </label>
                  </div>
                </section>

                <div className="flex items-center justify-end gap-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex items-center gap-2 rounded-(--radius-small) border-2 border-gray-300 px-8 py-3 font-semibold text-gray-700 transition-all hover:bg-gray-50"
                  >
                    <X className="h-5 w-5" />
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating}
                    className="flex items-center gap-2 rounded-(--radius-small) bg-blue-500 px-8 py-3 font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <UserPlus className="h-5 w-5" />
                    {isCreating ? "Creating..." : "Create User"}
                  </button>
                </div>
              </div>
            ) : null}
          </form>
        </div>
      </main>

      <style jsx global>{`
        :root {
          --font-heading-name: "Poppins";
          --font-body-name: "Inter";
          --font-heading: "Poppins", sans-serif;
          --font-body: "Inter", sans-serif;
          --radius-small: 0.5rem;
          --radius-large: 1rem;
          --shadow-custom: 0 10px 15px -3px rgba(30, 58, 138, 0.1), 0 4px 6px -2px rgba(30, 58, 138, 0.05);
          --shadow-custom-hover: 0 20px 25px -5px rgba(30, 58, 138, 0.15), 0 10px 10px -5px rgba(30, 58, 138, 0.04);
        }
      `}</style>
    </div>
  );
}
