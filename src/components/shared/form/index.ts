/**
 * Shared Form Component Library
 *
 * A consistent, modern form design system based on the Vault design language.
 * All forms should use these components for a unified look and feel.
 *
 * @example
 * ```tsx
 * import {
 *   FormInput,
 *   FormTextarea,
 *   FormSelect,
 *   FormButtonGroup,
 *   FormSection,
 *   FormTagInput,
 *   FormToggle,
 *   FormActions,
 * } from '@/components/shared/form';
 *
 * function MyForm() {
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       <FormSection id="details" title="Details" icon={Info} isOpen={true} onToggle={toggle}>
 *         <FormInput label="Name" value={name} onChange={setName} required />
 *         <FormSelect label="Status" value={status} onChange={setStatus} options={statusOptions} />
 *       </FormSection>
 *       <FormActions onCancel={handleCancel} isLoading={loading} />
 *     </form>
 *   );
 * }
 * ```
 */

// Core Components
export { default as FormInput } from './FormInput';
export { default as FormTextarea } from './FormTextarea';
export { default as FormSelect } from './FormSelect';
export { default as FormButtonGroup } from './FormButtonGroup';
export { default as FormSection } from './FormSection';
export { default as FormSectionHeader } from './FormSectionHeader';
export { default as FormTagInput } from './FormTagInput';
export { default as FormToggle } from './FormToggle';
export { default as FormActions } from './FormActions';

// Supporting Components
export { default as FormLabel } from './FormLabel';
export { default as FormError } from './FormError';

// Types
export type { FormInputProps } from './FormInput';
export type { FormTextareaProps } from './FormTextarea';
export type { FormSelectProps, SelectOption } from './FormSelect';
export type { FormButtonGroupProps, ButtonGroupOption, HoverColorVariant } from './FormButtonGroup';
export type { FormSectionProps } from './FormSection';
export type { FormSectionHeaderProps } from './FormSectionHeader';
export type { FormTagInputProps } from './FormTagInput';
export type { FormToggleProps } from './FormToggle';
export type { FormActionsProps } from './FormActions';
export type { FormLabelProps } from './FormLabel';
export type { FormErrorProps } from './FormError';

// Style utilities (for advanced customization)
export * from './formStyles';
