import dbConnect from "@/lib/db";
import messageModle from "@/model/Message";

export async function GET(request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return Response.json(
        {
          message: "Session expired please login again",
          success: false,
        },
        {
          status: 404,
        }
      );
    }

    const todoAccordingToUserId = await messageModle.find({ userId });

    return Response.json(
      {
        data: todoAccordingToUserId,
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error while getting todo", error);
    return Response.json(
      {
        message: "Error while getting todo",
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request) {
  await dbConnect();
  try {
    const { userId, title, description, isCompleted } = await request.json();

    if (!userId) {
      return Response.json(
        {
          message: "Session expired please login again",
          success: false,
        },
        {
          status: 500,
        }
      );
    }

    if (!title) {
      return Response.json(
        {
          message: "Title is required",
          success: false,
        },
        {
          status: 400,
        }
      );
    }

    if (!description) {
      return Response.json(
        {
          message: "Description is required",
          success: false,
        },
        {
          status: 400,
        }
      );
    }

    const addNewTodo = new messageModle({
      userId,
      title,
      description,
      isCompleted,
    });

    await addNewTodo.save();

    return Response.json(
      {
        success: true,
        message: "Todo added successfully",
      },
      { success: 200 }
    );
  } catch (error) {
    console.log("Error while adding todo", error);
    return Response.json(
      {
        message: "Error while adding todo",
        success: false,
      },
      {
        status: 400,
      }
    );
  }
}
