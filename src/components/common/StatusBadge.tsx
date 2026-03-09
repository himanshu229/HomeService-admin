import React from "react";
import { BookingStatus } from "../../types";

const badgeClasses: Record<BookingStatus, string> = {
  pending:             "badge-pending",
  technician_assigned: "badge-assigned",
  on_the_way:          "badge-onway",
  in_progress:         "badge-inprogress",
  completed:           "badge-completed",
  cancelled:           "badge-cancelled",
};

const labels: Record<BookingStatus, string> = {
  pending:             "Pending",
  technician_assigned: "Technician Assigned",
  on_the_way:          "On The Way",
  in_progress:         "In Progress",
  completed:           "Completed",
  cancelled:           "Cancelled",
};

interface Props {
  status: BookingStatus;
}

const StatusBadge: React.FC<Props> = ({ status }) => (
  <span className={badgeClasses[status]}>{labels[status]}</span>
);

export default StatusBadge;
