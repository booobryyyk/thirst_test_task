import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from './sidebar';

function SidebarState() {
  const { state } = useSidebar();
  return <output data-testid="sidebar-state">{state}</output>;
}

function SidebarFixture() {
  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>Header</SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Workspace</SidebarGroupLabel>
            <SidebarGroupAction aria-label="Add workspace">+</SidebarGroupAction>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive tooltip="Home help">Home</SidebarMenuButton>
                  <SidebarMenuAction aria-label="More home actions">...</SidebarMenuAction>
                  <SidebarMenuBadge>3</SidebarMenuBadge>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem><SidebarMenuSubButton isActive>Overview</SidebarMenuSubButton></SidebarMenuSubItem>
                  </SidebarMenuSub>
                </SidebarMenuItem>
              </SidebarMenu>
              <SidebarMenuSkeleton showIcon />
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarSeparator />
        <SidebarFooter><SidebarInput aria-label="Search navigation" /></SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset><SidebarTrigger /> <SidebarState /></SidebarInset>
    </SidebarProvider>
  );
}

describe('<Sidebar />', () => {
  it('renders every sidebar building block and toggles state from the trigger, rail, and shortcut', () => {
    cy.viewport(1024, 768);
    cy.mount(<SidebarFixture />);

    cy.get('[data-slot="sidebar-header"]').should('contain', 'Header');
    cy.get('[data-slot="sidebar-group-label"]').should('contain', 'Workspace');
    cy.get('[data-slot="sidebar-menu-button"]').should('have.attr', 'data-active');
    cy.get('[data-slot="sidebar-menu-badge"]').should('have.text', '3');
    cy.get('[data-sidebar="menu-skeleton-icon"]').should('exist');
    cy.get('[data-slot="sidebar-menu-sub-button"]').should('have.attr', 'data-active');
    cy.get('input[aria-label="Search navigation"]').should('exist');
    cy.get('[data-testid="sidebar-state"]').should('have.text', 'expanded');

    cy.get('[data-slot="sidebar-trigger"]').click();
    cy.get('[data-testid="sidebar-state"]').should('have.text', 'collapsed');
    cy.get('[data-slot="sidebar-rail"]').click({ force: true });
    cy.get('[data-testid="sidebar-state"]').should('have.text', 'expanded');
    cy.get('body').trigger('keydown', { key: 'b', ctrlKey: true });
    cy.get('[data-testid="sidebar-state"]').should('have.text', 'collapsed');
  });

  it('renders the non-collapsible sidebar variant without requiring desktop layout', () => {
    cy.mount(<SidebarProvider><Sidebar collapsible="none">Persistent navigation</Sidebar></SidebarProvider>);

    cy.get('[data-slot="sidebar"]').should('contain', 'Persistent navigation');
  });
});
