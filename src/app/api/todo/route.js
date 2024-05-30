import dbConnect from "@/lib/db";

export async function GET(request) {
  dbConnect();

  return Response.json(
    {
      message: "hello world",
      success: true,
    },
    { status: 200 }
  );
}
