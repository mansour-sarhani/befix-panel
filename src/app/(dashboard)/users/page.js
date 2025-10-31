"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchUsers, deleteUser, setFilters, setPage } from "@/features/users/usersSlice";
import { toast } from "sonner";
import {
    Table,
    TableHeader,
    TableHeaderCell,
    TableRow,
    TableCell,
    TableActions,
} from "@/components/tables";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { Badge } from "@/components/common/Badge";
import { Modal } from "@/components/common/Modal";
import { Loader } from "@/components/common/Loader";
import { Skeleton } from "@/components/common/Skeleton";
import { Pagination } from "@/components/common/Pagination";
import { Avatar } from "@/components/common/Avatar";
import { InputField } from "@/components/forms/InputField";
import { SelectField } from "@/components/forms/SelectField";
import { Users, Plus, Search, Filter } from "lucide-react";

export default function UsersPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();

    const {
        list: users,
        loading,
        error,
        pagination,
        filters,
    } = useAppSelector((state) => state.users);

    const [searchTerm, setSearchTerm] = useState(filters.search);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Fetch users on mount and when filters/pagination change
    useEffect(() => {
        dispatch(
            fetchUsers({
                page: pagination.page,
                limit: pagination.limit,
                search: filters.search,
                status: filters.status,
                role: filters.role,
                sortBy: "createdAt",
                sortOrder: "desc",
            })
        );
    }, [dispatch, pagination.page, pagination.limit, filters.search, filters.status, filters.role]);

    // Handle search input change (debounced)
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            dispatch(setFilters({ search: searchTerm }));
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [searchTerm, dispatch]);

    // Handle filter changes
    const handleFilterChange = (filterName, value) => {
        dispatch(setFilters({ [filterName]: value }));
        dispatch(setPage(1)); // Reset to first page when filters change
    };

    // Handle page change
    const handlePageChange = (newPage) => {
        dispatch(setPage(newPage));
    };

    // Handle delete user
    const handleDeleteClick = (user) => {
        setUserToDelete(user);
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!userToDelete) return;

        setIsDeleting(true);
        try {
            await dispatch(deleteUser(userToDelete._id)).unwrap();
            toast.success("User deleted successfully");
            setDeleteModalOpen(false);
            setUserToDelete(null);
        } catch (error) {
            toast.error(error.message || "Failed to delete user");
        } finally {
            setIsDeleting(false);
        }
    };

    // Get status badge variant
    const getStatusVariant = (status) => {
        switch (status) {
            case "active":
                return "success";
            case "inactive":
                return "warning";
            case "suspended":
                return "danger";
            default:
                return "default";
        }
    };

    // Get role badge variant
    const getRoleVariant = (role) => {
        switch (role) {
            case "admin":
                return "primary";
            case "manager":
                return "info";
            case "user":
                return "default";
            default:
                return "default";
        }
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1
                        className="text-2xl font-bold"
                        style={{ color: "var(--color-text-primary)" }}
                    >
                        User Management
                    </h1>
                    <p className="text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>
                        Manage system users and their permissions
                    </p>
                </div>
                <Button onClick={() => router.push("/users/create")} icon={<Plus size={18} />}>
                    Add User
                </Button>
            </div>

            {/* Filters Card */}
            <Card className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Search */}
                    <div className="md:col-span-2">
                        <div className="relative">
                            <Search
                                size={18}
                                className="absolute left-3 top-1/2 transform -translate-y-1/2"
                                style={{ color: "var(--color-text-secondary)" }}
                            />
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-lg border"
                                style={{
                                    borderColor: "var(--color-border)",
                                    backgroundColor: "var(--color-background)",
                                    color: "var(--color-text-primary)",
                                }}
                            />
                        </div>
                    </div>

                    {/* Status Filter */}
                    <div>
                        <select
                            value={filters.status}
                            onChange={(e) => handleFilterChange("status", e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border"
                            style={{
                                borderColor: "var(--color-border)",
                                backgroundColor: "var(--color-background)",
                                color: "var(--color-text-primary)",
                            }}
                        >
                            <option value="all">All Statuses</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="suspended">Suspended</option>
                        </select>
                    </div>

                    {/* Role Filter */}
                    <div>
                        <select
                            value={filters.role}
                            onChange={(e) => handleFilterChange("role", e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border"
                            style={{
                                borderColor: "var(--color-border)",
                                backgroundColor: "var(--color-background)",
                                color: "var(--color-text-primary)",
                            }}
                        >
                            <option value="all">All Roles</option>
                            <option value="admin">Admin</option>
                            <option value="manager">Manager</option>
                            <option value="user">User</option>
                        </select>
                    </div>
                </div>
            </Card>

            {/* Users Table */}
            <Card>
                {loading ? (
                    <Skeleton type="table" rows={10} />
                ) : error ? (
                    <div className="text-center py-12">
                        <p style={{ color: "var(--color-error)" }}>{error}</p>
                        <Button
                            variant="primary"
                            className="mt-4"
                            onClick={() =>
                                dispatch(
                                    fetchUsers({
                                        page: pagination.page,
                                        limit: pagination.limit,
                                        search: filters.search,
                                        status: filters.status,
                                        role: filters.role,
                                    })
                                )
                            }
                        >
                            Retry
                        </Button>
                    </div>
                ) : users.length === 0 ? (
                    <div className="text-center py-12">
                        <Users
                            size={48}
                            style={{ color: "var(--color-text-secondary)", margin: "0 auto" }}
                        />
                        <p className="mt-4" style={{ color: "var(--color-text-secondary)" }}>
                            No users found
                        </p>
                    </div>
                ) : (
                    <>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHeaderCell key="name">Name</TableHeaderCell>
                                    <TableHeaderCell key="email">Email</TableHeaderCell>
                                    <TableHeaderCell key="role">Role</TableHeaderCell>
                                    <TableHeaderCell key="status">Status</TableHeaderCell>
                                    <TableHeaderCell key="phone">Phone</TableHeaderCell>
                                    <TableHeaderCell key="created">Created At</TableHeaderCell>
                                    <TableHeaderCell key="actions" align="right">
                                        Actions
                                    </TableHeaderCell>
                                </TableRow>
                            </TableHeader>
                            <tbody>
                                {users.map((user) => (
                                    <TableRow key={user._id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar 
                                                    src={user.avatar} 
                                                    alt={user.name}
                                                    size="sm"
                                                />
                                                <div
                                                    className="font-medium"
                                                    style={{ color: "var(--color-text-primary)" }}
                                                >
                                                    {user.name}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span style={{ color: "var(--color-text-secondary)" }}>
                                                {user.email}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={getRoleVariant(user.role)}>
                                                {user.role}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusVariant(user.status)}>
                                                {user.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <span style={{ color: "var(--color-text-secondary)" }}>
                                                {user.phone || "-"}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <span style={{ color: "var(--color-text-secondary)" }}>
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </span>
                                        </TableCell>
                                        <TableCell align="right">
                                            <TableActions
                                                onView={() => router.push(`/users/${user._id}`)}
                                                onEdit={() =>
                                                    router.push(`/users/${user._id}/edit`)
                                                }
                                                onDelete={() => handleDeleteClick(user)}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </tbody>
                        </Table>

                        {/* Pagination */}
                        <div className="mt-6">
                            <Pagination
                                currentPage={pagination.page}
                                totalPages={pagination.pages}
                                onPageChange={handlePageChange}
                                totalItems={pagination.total}
                                itemsPerPage={pagination.limit}
                            />
                        </div>
                    </>
                )}
            </Card>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                title="Delete User"
            >
                <div className="space-y-4">
                    <p style={{ color: "var(--color-text-primary)" }}>
                        Are you sure you want to delete <strong>{userToDelete?.name}</strong>? This
                        action cannot be undone.
                    </p>
                    <div className="flex gap-3 justify-end">
                        <Button
                            variant="secondary"
                            onClick={() => setDeleteModalOpen(false)}
                            disabled={isDeleting}
                        >
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={confirmDelete} loading={isDeleting}>
                            Delete
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
