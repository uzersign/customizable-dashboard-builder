"use client"

import { generateId } from "@/lib/utils"

// Advanced template configurations with detailed components
export const advancedTemplates = {
  "crypto-trading": {
    id: "crypto-trading-pro",
    name: "Crypto Trading Pro",
    description:
      "Professional cryptocurrency trading dashboard with real-time data, portfolio tracking, and market analysis",
    category: "Finance",
    pages: 8,
    components: 35,
    theme: {
      primaryColor: "#f7931a",
      secondaryColor: "#4a5568",
      backgroundColor: "#1a202c",
      textColor: "#ffffff",
      fontFamily: "Roboto Mono",
      fontSize: "14px",
    },
    components: [
      // Portfolio Overview
      {
        id: generateId(),
        type: "metric-card",
        props: { title: "Portfolio Value", value: "$847,392.50", change: "+12.5%", trend: "up" },
        gridArea: { row: 1, col: 1, rowSpan: 2, colSpan: 3 },
        style: {
          backgroundColor: "#2d3748",
          color: "white",
          borderLeft: "4px solid #f7931a",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3)",
        },
      },
      {
        id: generateId(),
        type: "metric-card",
        props: { title: "24h P&L", value: "+$23,847.20", change: "+2.9%", trend: "up" },
        gridArea: { row: 1, col: 4, rowSpan: 2, colSpan: 3 },
        style: {
          backgroundColor: "#2d3748",
          color: "white",
          borderLeft: "4px solid #48bb78",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3)",
        },
      },
      {
        id: generateId(),
        type: "metric-card",
        props: { title: "Active Positions", value: "12", change: "+2", trend: "up" },
        gridArea: { row: 1, col: 7, rowSpan: 2, colSpan: 3 },
        style: {
          backgroundColor: "#2d3748",
          color: "white",
          borderLeft: "4px solid #4299e1",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3)",
        },
      },
      {
        id: generateId(),
        type: "metric-card",
        props: { title: "Win Rate", value: "73.2%", change: "+1.8%", trend: "up" },
        gridArea: { row: 1, col: 10, rowSpan: 2, colSpan: 3 },
        style: {
          backgroundColor: "#2d3748",
          color: "white",
          borderLeft: "4px solid #9f7aea",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3)",
        },
      },

      // Price Chart
      {
        id: generateId(),
        type: "line-chart",
        props: {
          title: "BTC/USD - 24H Price Action",
          data: [
            { name: "00:00", value: 43250 },
            { name: "04:00", value: 43180 },
            { name: "08:00", value: 43420 },
            { name: "12:00", value: 43680 },
            { name: "16:00", value: 43520 },
            { name: "20:00", value: 43750 },
            { name: "24:00", value: 43890 },
          ],
        },
        gridArea: { row: 3, col: 1, rowSpan: 5, colSpan: 8 },
        style: {
          backgroundColor: "#2d3748",
          color: "white",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3)",
        },
      },

      // Top Cryptocurrencies
      {
        id: generateId(),
        type: "data-table",
        props: {
          title: "Top Holdings",
          columns: ["Asset", "Amount", "Value", "24h Change"],
          data: [
            ["BTC", "12.5847", "$549,234", "+2.5%"],
            ["ETH", "45.2341", "$156,789", "+4.2%"],
            ["ADA", "15,000", "$18,750", "-1.8%"],
            ["DOT", "2,500", "$67,500", "+6.3%"],
            ["LINK", "1,200", "$28,800", "+3.1%"],
          ],
        },
        gridArea: { row: 3, col: 9, rowSpan: 5, colSpan: 4 },
        style: {
          backgroundColor: "#2d3748",
          color: "white",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3)",
        },
      },

      // Market Overview
      {
        id: generateId(),
        type: "pie-chart",
        props: {
          title: "Portfolio Allocation",
          data: [
            { name: "Bitcoin", value: 65 },
            { name: "Ethereum", value: 18 },
            { name: "Altcoins", value: 12 },
            { name: "Stablecoins", value: 5 },
          ],
        },
        gridArea: { row: 8, col: 1, rowSpan: 4, colSpan: 4 },
        style: {
          backgroundColor: "#2d3748",
          color: "white",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3)",
        },
      },

      // Trading Performance
      {
        id: generateId(),
        type: "bar-chart",
        props: {
          title: "Monthly Trading Performance",
          data: [
            { name: "Jan", value: 15.2 },
            { name: "Feb", value: -3.8 },
            { name: "Mar", value: 22.1 },
            { name: "Apr", value: 8.7 },
            { name: "May", value: 18.9 },
            { name: "Jun", value: 12.5 },
          ],
        },
        gridArea: { row: 8, col: 5, rowSpan: 4, colSpan: 4 },
        style: {
          backgroundColor: "#2d3748",
          color: "white",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3)",
        },
      },

      // Recent Trades
      {
        id: generateId(),
        type: "data-table",
        props: {
          title: "Recent Trades",
          columns: ["Time", "Pair", "Side", "Amount", "Price"],
          data: [
            ["14:32", "BTC/USD", "BUY", "0.5", "$43,750"],
            ["14:28", "ETH/USD", "SELL", "2.0", "$3,125"],
            ["14:15", "ADA/USD", "BUY", "1000", "$1.25"],
            ["14:02", "DOT/USD", "BUY", "50", "$27.00"],
            ["13:45", "LINK/USD", "SELL", "100", "$24.00"],
          ],
        },
        gridArea: { row: 8, col: 9, rowSpan: 4, colSpan: 4 },
        style: {
          backgroundColor: "#2d3748",
          color: "white",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3)",
        },
      },
    ],
  },

  "restaurant-management": {
    id: "restaurant-management-pro",
    name: "Restaurant Management Pro",
    description: "Complete restaurant management system with orders, inventory, staff, and customer analytics",
    category: "Hospitality",
    pages: 7,
    components: 30,
    theme: {
      primaryColor: "#dc2626",
      secondaryColor: "#7c2d12",
      backgroundColor: "#fef7f0",
      textColor: "#1f2937",
      fontFamily: "Poppins",
      fontSize: "14px",
    },
    components: [
      // Daily Overview
      {
        id: generateId(),
        type: "metric-card",
        props: { title: "Today's Revenue", value: "$8,247", change: "+15.2%", trend: "up" },
        gridArea: { row: 1, col: 1, rowSpan: 2, colSpan: 3 },
        style: {
          backgroundColor: "#ffffff",
          borderLeft: "4px solid #dc2626",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        },
      },
      {
        id: generateId(),
        type: "metric-card",
        props: { title: "Orders Served", value: "247", change: "+8.3%", trend: "up" },
        gridArea: { row: 1, col: 4, rowSpan: 2, colSpan: 3 },
        style: {
          backgroundColor: "#ffffff",
          borderLeft: "4px solid #059669",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        },
      },
      {
        id: generateId(),
        type: "metric-card",
        props: { title: "Avg Order Value", value: "$33.40", change: "+5.7%", trend: "up" },
        gridArea: { row: 1, col: 7, rowSpan: 2, colSpan: 3 },
        style: {
          backgroundColor: "#ffffff",
          borderLeft: "4px solid #3b82f6",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        },
      },
      {
        id: generateId(),
        type: "metric-card",
        props: { title: "Customer Rating", value: "4.8/5", change: "+0.2", trend: "up" },
        gridArea: { row: 1, col: 10, rowSpan: 2, colSpan: 3 },
        style: {
          backgroundColor: "#ffffff",
          borderLeft: "4px solid #f59e0b",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        },
      },
    ],
  },

  "real-estate-portfolio": {
    id: "real-estate-portfolio-pro",
    name: "Real Estate Portfolio Pro",
    description:
      "Professional real estate portfolio management with property analytics, ROI tracking, and market insights",
    category: "Real Estate",
    pages: 6,
    components: 28,
    theme: {
      primaryColor: "#059669",
      secondaryColor: "#065f46",
      backgroundColor: "#f0fdf4",
      textColor: "#1f2937",
      fontFamily: "Inter",
      fontSize: "14px",
    },
    components: [
      // Portfolio Overview
      {
        id: generateId(),
        type: "metric-card",
        props: { title: "Portfolio Value", value: "$12.4M", change: "+8.2%", trend: "up" },
        gridArea: { row: 1, col: 1, rowSpan: 2, colSpan: 3 },
        style: {
          backgroundColor: "#ffffff",
          borderLeft: "4px solid #059669",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        },
      },
      {
        id: generateId(),
        type: "metric-card",
        props: { title: "Monthly Rental Income", value: "$47,850", change: "+3.5%", trend: "up" },
        gridArea: { row: 1, col: 4, rowSpan: 2, colSpan: 3 },
        style: {
          backgroundColor: "#ffffff",
          borderLeft: "4px solid #3b82f6",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        },
      },
      {
        id: generateId(),
        type: "metric-card",
        props: { title: "Occupancy Rate", value: "94.2%", change: "+1.8%", trend: "up" },
        gridArea: { row: 1, col: 7, rowSpan: 2, colSpan: 3 },
        style: {
          backgroundColor: "#ffffff",
          borderLeft: "4px solid #f59e0b",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        },
      },
      {
        id: generateId(),
        type: "metric-card",
        props: { title: "Average ROI", value: "12.8%", change: "+0.9%", trend: "up" },
        gridArea: { row: 1, col: 10, rowSpan: 2, colSpan: 3 },
        style: {
          backgroundColor: "#ffffff",
          borderLeft: "4px solid #8b5cf6",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        },
      },
    ],
  },
}
