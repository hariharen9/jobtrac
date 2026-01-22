import React from 'react';
import {
  sectionHeaderContainer,
  sectionHeaderIcon,
  sectionHeaderTitle,
  cx,
} from './formStyles';

export interface FormSectionHeaderProps {
  /** Section title */
  title: string;
  /** Icon to display */
  icon?: React.ComponentType<{ className?: string }>;
  /** Additional CSS classes */
  className?: string;
}

const FormSectionHeader: React.FC<FormSectionHeaderProps> = ({
  title,
  icon: Icon,
  className,
}) => {
  return (
    <div className={cx(sectionHeaderContainer, className)}>
      {Icon && <Icon className={sectionHeaderIcon} />}
      <h3 className={sectionHeaderTitle}>{title}</h3>
    </div>
  );
};

export default FormSectionHeader;
