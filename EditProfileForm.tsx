import { useForm, type SubmitHandler, useFieldArray, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, X } from "lucide-react";

const editProfileScheme = z.object({
  fullName: z.string().min(1, "ПІБ обов'язкове"),
  email: z.string().email("Невірний формат email"),
  phones: z.array(
    z.object({
      number: z.string().min(1, "Номер обов'язковий"),
    })
  ),
  languages: z.array(z.string()).min(1, "Виберіть хоча б одну мову"),
});

type IEditProfileForm = z.infer<typeof editProfileScheme>;

export default function EditProfileForm() {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IEditProfileForm>({
    resolver: zodResolver(editProfileScheme),
    defaultValues: {
      fullName: "",
      email: "",
      phones: [{ number: "" }],
      languages: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "phones",
  });

  const onSubmit: SubmitHandler<IEditProfileForm> = (data) => {
    console.log("New profile data: ", data);
  };

  const languageOptions = [
    { value: "uk", label: "Українська" },
    { value: "en", label: "Англійська" },
    { value: "pl", label: "Іспанська" },
    { value: "de", label: "Німецька" },
  ];

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md mx-auto p-6 border border-blue-500 rounded-sm flex flex-col justify-center gap-4 bg-slate-900"
    >
      <h2 className="text-white text-2xl font-bold text-center">
        Редагувати профіль
      </h2>

      <div className="flex flex-col gap-1">
        <label className="text-white text-sm">ПІБ студента</label>
        <input
          type="text"
          placeholder="Іванов Іван Іванович"
          className="border border-blue-500 bg-blue-100 rounded-xl p-2 text-black"
          {...register("fullName")}
        />
        {errors.fullName && <span className="text-red-400 text-xs">{errors.fullName.message}</span>}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-white text-sm">Електронна пошта</label>
        <input
          type="email"
          placeholder="student@example.com"
          className="border border-blue-500 bg-blue-100 rounded-xl p-2 text-black"
          {...register("email")}
        />
        {errors.email && <span className="text-red-400 text-xs">{errors.email.message}</span>}
      </div>

      <h3 className="text-white text-xl font-bold mt-2">Номери телефонів</h3>
      <div className="flex flex-col gap-2">
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-center gap-2">
            <input
              type="tel"
              placeholder="+38011111111"
              className="border border-blue-500 bg-blue-100 rounded-xl p-2 text-black w-full"
              {...register(`phones.${index}.number`)}
            />
            {fields.length > 1 && (
              <button
                type="button"
                onClick={() => remove(index)}
                className="text-red-400 hover:text-red-300 p-1"
              >
                <X />
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={() => append({ number: "" })}
          className="bg-blue-950 px-4 py-2 text-md text-white rounded-xl hover:scale-[1.02] transition-all mt-1"
        >
          + Додати номер
        </button>
      </div>

      <div className="flex flex-col gap-1 mt-2">
        <label className="text-white text-xl font-bold">Володіння мовами</label>
        <Controller
          name="languages"
          control={control}
          render={({ field }) => (
            <select
              multiple
              value={field.value}
              onChange={(e) => {
                const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
                field.onChange(selectedOptions);
              }}
              className="border border-blue-500 bg-blue-100 rounded-xl p-2 text-black h-28"
            >
              {languageOptions.map((lang) => (
                <option key={lang.value} value={lang.value} className="p-1">
                  {lang.label}
                </option>
              ))}
            </select>
          )}
        />
        <span className="text-gray-400 text-xs">* Затисніть Ctrl (або Cmd), щоб вибрати кілька мов</span>
        {errors.languages && <span className="text-red-400 text-xs">{errors.languages.message}</span>}
      </div>

      <button
        disabled={isSubmitting}
        type="submit"
        className="font-bold bg-blue-950 px-4 py-2 text-lg text-white rounded-xl hover:scale-[1.02] transition-all flex justify-center items-center mt-4"
      >
        {isSubmitting ? <Loader2 className="animate-spin" /> : "Зберегти зміни"}
      </button>
    </form>
  );
}
