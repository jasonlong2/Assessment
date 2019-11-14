The data store for this solution is MongoDB. Since relational data is being stored, the use of MongoDB is not ideal; it was chosen because of its ease of use.

The solution lacks tests due to time constraints.

Regarding the json example for creating an event -
It seems unusual that a LOGIN event would be posted separately from an actual user login request, but it was implemented that way. Also, since no UserId was included in the json example, it was assumed that the UserId should be provided outside of the request body. This could either be done via an authorization header or in the route. This solution uses an authorization header. Although, in hindsight and with YAGNI in mind, it may have been better to use the route since this would have been simpler to implement.

Regarding the "return all events for the last day" requirement, it was assumed that this meant return all events that were created between the current datetime - 1 day and the current datetime.