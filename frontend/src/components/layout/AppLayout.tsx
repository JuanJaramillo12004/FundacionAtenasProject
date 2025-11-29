import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
  SidebarMenuSub,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  LineChart,
  HelpCircle,
  LogOut,
  ChevronRight,
  User,
} from "lucide-react";
import { Outlet, Link, useLocation } from "react-router-dom";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import type { ReactNode } from "react";
import FullScreenLoader from "@/components/common/FullScreenLoader";
import FullScreenError from "@/components/common/FullScreenError";
import { RawRole, getRoleLabel } from "@/lib/roles";
import { useAuth } from "@/hooks/useAuth";
import * as React from "react";

type SubMenuItem = {
  id: string;
  label: string;
  icon: ReactNode;
  href?: string;
  submenu?: SubMenuItem[];
};

type MenuItem = {
  id: string;
  label: string;
  icon: ReactNode;
  href?: string;
  submenu?: SubMenuItem[];
};

const adminItems: MenuItem[] = [
  {
    id: "inicio",
    label: "Inicio",
    icon: <LineChart />,
    href: "/app",
  },
];

const directorItems: MenuItem[] = [
  {
    id: "inicio",
    label: "Inicio",
    icon: <LineChart />,
    href: "/app",
  },
  {
    id: "perfil",
    label: "Perfil",
    icon: <User />,
    href: "/app/profile",
  },
];

const donatorItems: MenuItem[] = [
  {
    id: "inicio",
    label: "Inicio",
    icon: <LineChart />,
    href: "/app",
  },
  {
    id: "perfil",
    label: "Perfil",
    icon: <User />,
    href: "/app/profile",
  },
];

const bottomItems: MenuItem[] = [
  { id: "ayuda", label: "Ayuda", icon: <HelpCircle /> },
  { id: "logout", label: "Cerrar sesión", icon: <LogOut /> },
];

function SidebarAutoClose() {
  const location = useLocation();
  const { setOpen } = useSidebar();

  React.useEffect(() => {
    if (location.pathname === "/app/financiero/estado-cuenta") {
      setOpen(false);
    }
  }, [location.pathname, setOpen]);

  return null;
}

function AppLayoutContent() {
  const { user, isLoading, signOut } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <FullScreenLoader message="Cargando tu información..." />;
  }

  if (!user) {
    return <FullScreenError message="No se encontró una sesión activa." />;
  }

  const role = user.role ?? RawRole.DONATOR;

  const getMenuItems = (): MenuItem[] => {
    switch (role) {
      case RawRole.ADMIN:
        return adminItems;
      case RawRole.DIRECTOR:
        return directorItems;
      case RawRole.DONATOR:
        return donatorItems;
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  const handleLogout = async () => {
    await signOut();
    window.location.href = "/login";
  };

  const isActive = (href: string) => {
    if (!href) return false;
    if (href === "/app") {
      return location.pathname === "/app";
    }
    return location.pathname.startsWith(href);
  };

  const roleLabel = getRoleLabel(role);
  const displayName = user.username ?? user.first_name ?? user.email?.split('@')[0] ?? "Usuario";
    
  return (
    <SidebarProvider>
      <SidebarAutoClose />
      <Sidebar
        className="bg-primary text-primary-foreground"
        collapsible="offcanvas"
      >
        {/* Header */}
        <SidebarHeader className="p-4 bg-primary">
          <div className="flex items-center gap-3">
            <div className="leading-tight">
              <div className="text-base font-semibold">
                {displayName}
              </div>
              <div className="text-xs opacity-80">{roleLabel}</div>
            </div>
          </div>
          <SidebarSeparator className="my-4 bg-white/20" />
        </SidebarHeader>

        {/* Menu */}
        <SidebarContent className="px-2 bg-primary">
          <SidebarGroup>
            <SidebarGroupLabel className="sr-only">
              Menú principal
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) =>
                  item.submenu ? (
                    <Collapsible key={item.id} className="group/collapsible">
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton className="text-base h-12 px-3 rounded-lg hover:bg-white/10 data-[state=open]:bg-white/20 data-[state=open]:font-semibold data-[state=open]:text-white">
                            {item.icon}
                            <span>{item.label}</span>
                            <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.submenu.map((sub) => (
                              <SidebarMenuSubItem key={sub.id}>
                                <SidebarMenuButton
                                  asChild
                                  isActive={
                                    sub.href ? isActive(sub.href) : false
                                  }
                                  className="text-sm h-10 px-3 rounded-md hover:bg-white/10 data-[active=true]:bg-white/20 data-[active=true]:font-medium data-[active=true]:text-white"
                                >
                                  {sub.href ? (
                                    <Link to={sub.href}>
                                      {sub.icon}
                                      <span>{sub.label}</span>
                                    </Link>
                                  ) : (
                                    <div>
                                      {sub.icon}
                                      <span>{sub.label}</span>
                                    </div>
                                  )}
                                </SidebarMenuButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  ) : (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        asChild
                        isActive={item.href ? isActive(item.href) : false}
                        className="text-base h-12 px-3 rounded-lg hover:bg-white/10 data-[active=true]:bg-white/20 data-[active=true]:font-semibold data-[active=true]:text-white"
                      >
                        {item.href ? (
                          <Link to={item.href}>
                            {item.icon}
                            <span>{item.label}</span>
                          </Link>
                        ) : (
                          <div>
                            {item.icon}
                            <span>{item.label}</span>
                          </div>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* Footer */}
        <SidebarFooter className="mt-auto px-2 pb-4 bg-primary">
          <Separator className="bg-white/20 mb-4" />
          <SidebarMenu>
            {bottomItems.map((item) => (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton
                  className="h-12 px-3 rounded-lg hover:bg-white/10"
                  onClick={item.id === "logout" ? handleLogout : undefined}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      {/* Contenido principal */}
      <SidebarInset className="flex flex-col h-screen">
        <header className="flex h-14 items-center gap-2 border-b px-4 flex-shrink-0">
          <SidebarTrigger />
        </header>
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default function AppLayout() {
  return <AppLayoutContent />;
}
