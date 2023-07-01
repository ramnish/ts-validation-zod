import { z } from "zod";
import { fromZodError } from "zod-validation-error";

const hobbies = ["Chess", "Carrom", "Cricket"] as const; //needs to be const

const UserSchema = z.object({
  username: z.string().min(5).max(100),
  age: z.number().gt(0),
  id: z.union([z.number(), z.string()]).default(Math.random),
  birthday: z.date().optional(),
  isProgrammer: z.boolean().default(true), //both null or bool
  test: z.unknown(),
  hobby: z.enum(hobbies),
  friends: z.array(z.string()),
  cords: z.tuple([z.number(), z.number(), z.number().gt(4)]),
});
// .deepPartial();
//strict
//passthrough
//merge

type User = z.infer<typeof UserSchema>;

const user = {
  id: 0,
  username: "Hello",
  age: 1,
  isProgrammer: true,
  hobby: "Chess",
  dsfdsf: "removed",
  friends: ["Arun"],
  cords: [1, 1, 6],
};

const userPartial = {
  id: 0,
  username: "Hello",
};

UserSchema.extend({ FirstName: z.string() }); //added

console.log(UserSchema.parse(user));
console.log(UserSchema.safeParse(user).success);
console.log(UserSchema.shape.age);
console.log(UserSchema.partial().parse(userPartial)); //Partial match

const discriminatedSchema = z.object({
  response: z.discriminatedUnion("status", [
    z.object({ status: z.literal("success"), data: z.string() }),
    z.object({ status: z.literal("failed"), error: z.instanceof(Error) }),
  ]),
}); //Validation based on status

console.log(
  discriminatedSchema.safeParse({
    response: { status: "success", data: "data1" },
  })
);

//Map validation

const UserMapSchema = z.map(z.string(), z.object({ name: z.string() }));

const userMap = new Map([["id-1", { name: "Ramnish" }]]);

console.log(UserMapSchema.parse(userMap));

//Promise Validation
const PromiseSchema = z.promise(z.string());

const p = Promise.resolve("Ram");

console.log(PromiseSchema.parse(p));

// Custom validation

const EmailSchema = z
  .string()
  .refine((val) => val.endsWith("@gcitsolutions.com"), {
    message: "Email Must end with gcitsolutions.com",
  });

console.log(EmailSchema.parse("ramnish@gcitsolutions.com"));

//Zod error messages
const result = EmailSchema.safeParse("ramnish@gmail.com");
if (!result.success) {
  console.log(fromZodError(result.error));
}
