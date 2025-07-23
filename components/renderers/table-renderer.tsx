"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, Download, MoreHorizontal } from "lucide-react"
import { useState } from "react"

interface TableRendererProps {
  component: {
    id: string
    type: string
    props: {
      title?: string
      data?: any[]
      columns?: Array<{
        key: string
        label: string
        type?: "text" | "number" | "badge" | "action"
      }>
      searchable?: boolean
      filterable?: boolean
      exportable?: boolean
      pagination?: boolean
      pageSize?: number
    }
    style?: Record<string, any>
  }
}

const defaultData = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "Admin",
    status: "Active",
    lastLogin: "2024-01-15",
    orders: 23,
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    role: "User",
    status: "Active",
    lastLogin: "2024-01-14",
    orders: 15,
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "User",
    status: "Inactive",
    lastLogin: "2024-01-10",
    orders: 8,
  },
  {
    id: 4,
    name: "Alice Brown",
    email: "alice@example.com",
    role: "Moderator",
    status: "Active",
    lastLogin: "2024-01-15",
    orders: 31,
  },
]

const defaultColumns = [
  { key: "name", label: "Name", type: "text" },
  { key: "email", label: "Email", type: "text" },
  { key: "role", label: "Role", type: "badge" },
  { key: "status", label: "Status", type: "badge" },
  { key: "orders", label: "Orders", type: "number" },
  { key: "actions", label: "Actions", type: "action" },
]

export function TableRenderer({ component }: TableRendererProps) {
  const { props, style } = component
  const {
    title = "Data Table",
    data = defaultData,
    columns = defaultColumns,
    searchable = true,
    filterable = true,
    exportable = true,
    pagination = true,
    pageSize = 10,
  } = props

  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  const filteredData = data.filter((row) =>
    Object.values(row).some((value) => String(value).toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const paginatedData = pagination
    ? filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : filteredData

  const totalPages = Math.ceil(filteredData.length / pageSize)

  const renderCell = (row: any, column: any) => {
    const value = row[column.key]

    switch (column.type) {
      case "badge":
        return (
          <Badge
            variant={value === "Active" ? "default" : value === "Inactive" ? "secondary" : "outline"}
            className={
              value === "Admin"
                ? "bg-purple-100 text-purple-800"
                : value === "Moderator"
                  ? "bg-blue-100 text-blue-800"
                  : value === "User"
                    ? "bg-gray-100 text-gray-800"
                    : ""
            }
          >
            {value}
          </Badge>
        )
      case "number":
        return <span className="font-mono">{value}</span>
      case "action":
        return (
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        )
      default:
        return <span>{value}</span>
    }
  }

  return (
    <Card className="h-full" style={style}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          <div className="flex items-center gap-2">
            {exportable && (
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            )}
            {filterable && (
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            )}
          </div>
        </div>
        {searchable && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column.key}>{column.label}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="text-center py-8 text-gray-500">
                    No data found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((row, index) => (
                  <TableRow key={row.id || index}>
                    {columns.map((column) => (
                      <TableCell key={column.key}>{renderCell(row, column)}</TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {pagination && totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-500">
              Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredData.length)} of{" "}
              {filteredData.length} entries
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
