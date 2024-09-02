class TicketStatus:
    NEW = "new"
    PENDING = "pending"
    CLOSED = "closed"
    DELETED = "deleted"

    CHOICES = (
        (NEW, "New"),
        (PENDING, "Pending"),
        (CLOSED, "Closed"),
        (DELETED, "Deleted"),
    )


class Priority:
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"

    CHOICES = (
        (LOW, "Low"),
        (MEDIUM, "Medium"),
        (HIGH, "High"),
    )
