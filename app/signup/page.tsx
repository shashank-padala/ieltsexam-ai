"use client";

import { useState, memo } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";

// STEP 1: Basic Info (Mandatory)
const Step1 = memo(function Step1({
  fullName,
  setFullName,
  email,
  setEmail,
  password,
  setPassword,
}: {
  fullName: string;
  setFullName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold text-black mb-2">Basic Information</h2>
      <input
        type="text"
        placeholder="Full Name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        className="p-2 border rounded text-black"
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="p-2 border rounded text-black"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="p-2 border rounded text-black"
      />
    </div>
  );
});

// STEP 2: Exam & Additional Preferences
const Step2 = memo(function Step2({
  preferredExamType,
  setPreferredExamType,
  immigrationCountry,
  setImmigrationCountry,
  purpose,
  setPurpose,
  examSlotBooked,
  setExamSlotBooked,
  examSlotDate,
  setExamSlotDate,
  marketingOptIn,
  setMarketingOptIn,
  referralCode,
  setReferralCode,
}: {
  preferredExamType: string;
  setPreferredExamType: (v: string) => void;
  immigrationCountry: string;
  setImmigrationCountry: (v: string) => void;
  purpose: string;
  setPurpose: (v: string) => void;
  examSlotBooked: string;
  setExamSlotBooked: (v: string) => void;
  examSlotDate: string;
  setExamSlotDate: (v: string) => void;
  marketingOptIn: boolean;
  setMarketingOptIn: (v: boolean) => void;
  referralCode: string;
  setReferralCode: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold text-black mb-2">
        Exam & Additional Preferences <span className="text-sm text-black">(Optional)</span>
      </h2>
      <p className="text-black font-medium">
        Which exam are you preparing for?
      </p>
      <div className="flex gap-4">
        <label className="flex items-center gap-2 text-black">
          <input
            type="radio"
            name="examType"
            value="Academic"
            checked={preferredExamType === "Academic"}
            onChange={(e) => setPreferredExamType(e.target.value)}
          />
          Academic
        </label>
        <label className="flex items-center gap-2 text-black">
          <input
            type="radio"
            name="examType"
            value="General"
            checked={preferredExamType === "General"}
            onChange={(e) => setPreferredExamType(e.target.value)}
          />
          General
        </label>
      </div>
      <input
        type="text"
        placeholder="Which country are you immigrating to?"
        value={immigrationCountry}
        onChange={(e) => setImmigrationCountry(e.target.value)}
        className="p-2 border rounded text-black"
      />
      <input
        type="text"
        placeholder="Purpose (e.g., Study, Immigration...)"
        value={purpose}
        onChange={(e) => setPurpose(e.target.value)}
        className="p-2 border rounded text-black"
      />
      <p className="text-black font-medium">Did you book exam?</p>
      <div className="flex gap-4">
        <label className="flex items-center gap-2 text-black">
          <input
            type="radio"
            name="bookedExam"
            value="Yes"
            checked={examSlotBooked === "Yes"}
            onChange={(e) => setExamSlotBooked(e.target.value)}
          />
          Yes
        </label>
        <label className="flex items-center gap-2 text-black">
          <input
            type="radio"
            name="bookedExam"
            value="No"
            checked={examSlotBooked === "No"}
            onChange={(e) => setExamSlotBooked(e.target.value)}
          />
          No
        </label>
      </div>
      <label className="flex flex-col text-black">
        <span className="mb-1">Exam Slot Date (Optional)</span>
        <input
          type="datetime-local"
          value={examSlotDate}
          onChange={(e) => setExamSlotDate(e.target.value)}
          className="p-2 border rounded text-black"
        />
      </label>
      <label className="flex items-center gap-2 text-black">
        <input
          type="checkbox"
          checked={marketingOptIn}
          onChange={(e) => setMarketingOptIn(e.target.checked)}
        />
        Receive marketing updates?
      </label>
      <input
        type="text"
        placeholder="Referral Code"
        value={referralCode}
        onChange={(e) => setReferralCode(e.target.value)}
        className="p-2 border rounded text-black"
      />
    </div>
  );
});

// STEP 3: Contact Details (Optional)
const Step3 = memo(function Step3({
  phone,
  setPhone,
  countryOfResidence,
  setCountryOfResidence,
  city,
  setCity,
  college,
  setCollege,
}: {
  phone: string;
  setPhone: (v: string) => void;
  countryOfResidence: string;
  setCountryOfResidence: (v: string) => void;
  city: string;
  setCity: (v: string) => void;
  college: string;
  setCollege: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold text-black mb-2">
        Contact Details <span className="text-sm text-black">(Optional)</span>
      </h2>
      <input
        type="text"
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="p-2 border rounded text-black"
      />
      <input
        type="text"
        placeholder="Country of Residence"
        value={countryOfResidence}
        onChange={(e) => setCountryOfResidence(e.target.value)}
        className="p-2 border rounded text-black"
      />
      <input
        type="text"
        placeholder="City"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="p-2 border rounded text-black"
      />
      <input
        type="text"
        placeholder="College"
        value={college}
        onChange={(e) => setCollege(e.target.value)}
        className="p-2 border rounded text-black"
      />
    </div>
  );
});

export default function Signup() {
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  // STEP 1: Basic Info
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // STEP 2: Exam & Additional Preferences
  const [preferredExamType, setPreferredExamType] = useState("Academic");
  const [immigrationCountry, setImmigrationCountry] = useState("");
  const [purpose, setPurpose] = useState("");
  const [examSlotBooked, setExamSlotBooked] = useState(""); // "Yes" or "No"
  const [examSlotDate, setExamSlotDate] = useState("");
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const [referralCode, setReferralCode] = useState("");

  // STEP 3: Contact Details
  const [phone, setPhone] = useState("");
  const [countryOfResidence, setCountryOfResidence] = useState("");
  const [city, setCity] = useState("");
  const [college, setCollege] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleNext = () => {
    // If on Step 1, check mandatory fields
    if (currentStep === 1) {
      if (!fullName.trim() || !email.trim() || !password.trim()) {
        setMessage("Please fill in all required fields in Step 1.");
        return; // Stop here; don't go to next step
      } else {
        // Clear error if fields are valid
        setMessage("");
      }
    }

    // If validation is okay, move to next step
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      setMessage(signUpError.message);
      setLoading(false);
      return;
    }

    const booked = examSlotBooked === "Yes";

    if (signUpData.user) {
      const user_id = signUpData.user.id;
      const { error: profileError } = await supabase
        .from("user_profiles")
        .insert([
          {
            user_id,
            full_name: fullName,
            email,
            preferred_exam_type: preferredExamType,
            immigration_country: immigrationCountry,
            purpose,
            exam_slot_booked: booked,
            ...(examSlotDate ? { exam_slot_date: examSlotDate } : {}),
            marketing_opt_in: marketingOptIn,
            referral_code: referralCode,
            phone,
            country_of_residence: countryOfResidence,
            city,
            college,
          },
        ]);

      if (profileError) {
        setMessage(`Signup successful, but error creating profile: ${profileError.message}`);
        setLoading(false);
        return;
      }
    }

    setMessage("Signup successful! Check your email for verification.");
    setTimeout(() => router.push("/login"), 2000);
    setLoading(false);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1
            fullName={fullName}
            setFullName={setFullName}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
          />
        );
      case 2:
        return (
          <Step2
            preferredExamType={preferredExamType}
            setPreferredExamType={setPreferredExamType}
            immigrationCountry={immigrationCountry}
            setImmigrationCountry={setImmigrationCountry}
            purpose={purpose}
            setPurpose={setPurpose}
            examSlotBooked={examSlotBooked}
            setExamSlotBooked={setExamSlotBooked}
            examSlotDate={examSlotDate}
            setExamSlotDate={setExamSlotDate}
            marketingOptIn={marketingOptIn}
            setMarketingOptIn={setMarketingOptIn}
            referralCode={referralCode}
            setReferralCode={setReferralCode}
          />
        );
      case 3:
        return (
          <Step3
            phone={phone}
            setPhone={setPhone}
            countryOfResidence={countryOfResidence}
            setCountryOfResidence={setCountryOfResidence}
            city={city}
            setCity={setCity}
            college={college}
            setCollege={setCollege}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-md shadow-lg p-8">
        <h1 className="text-2xl font-bold text-black mb-4">Sign Up</h1>
        <div className="flex items-center justify-between mb-6">
          <div className="text-black">
            Step {currentStep} of {totalSteps}
          </div>
          <div className="flex-1 ml-4 bg-gray-200 h-2 rounded">
            <div
              className="bg-blue-600 h-2 rounded"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>
        <form onSubmit={handleSignup} className="flex flex-col gap-6">
          {renderStep()}
          {message && <p className="text-red-500">{message}</p>}
          <div className="flex justify-between">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2 bg-gray-300 text-black rounded"
              >
                Back
              </button>
            )}
            {currentStep < totalSteps && (
              <button
                type="button"
                onClick={handleNext}
                className="ml-auto px-4 py-2 bg-blue-600 text-white rounded"
              >
                Next
              </button>
            )}
            {currentStep === totalSteps && (
              <button
                type="submit"
                disabled={loading}
                className="ml-auto px-4 py-2 bg-green-500 text-white rounded"
              >
                {loading ? "Signing up..." : "Sign Up"}
              </button>
            )}
          </div>
        </form>
        <p className="mt-4 text-black text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-500">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
