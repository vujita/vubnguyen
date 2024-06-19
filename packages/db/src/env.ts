import z from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().trim().min(1).url(),
});

type ENV = z.TypeOf<typeof envSchema>;
export const env: ENV = envSchema.safeParse(process.env).success
  ? envSchema.parse(process.env)
  : {
      DATABASE_URL: "",
    };

export default env;
