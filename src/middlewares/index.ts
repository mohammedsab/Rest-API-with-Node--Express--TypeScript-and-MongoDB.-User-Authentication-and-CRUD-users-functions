import express from "express";
import { get, merge } from "lodash";

import { getUserBySessionToken } from "../db/users";

export const isOwner = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { id } = req.params;
    const currentUserId = get(req, "identity._id") as string;

    if (!currentUserId) return res.sendStatus(403);

    if (currentUserId.toString() !== id) return res.sendStatus(403);

    next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const isAuthenticated = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    // Extract session token from the "AUTH" cookie
    const sessionToken = req.cookies["AUTH"];

    // If no session token is present, return a 403 Forbidden response
    if (!sessionToken) return res.sendStatus(403);

    // Retrieve the user based on the session token from the database
    const existingUser = await getUserBySessionToken(sessionToken);

    // If no user is found with the provided session token, return a 403 Forbidden response
    if (!existingUser) return res.sendStatus(403);

    // Merge the user information into the request object under the "identity" property
    merge(req, { identity: existingUser });

    // Continue processing the request by calling the next middleware or route handler
    return next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
