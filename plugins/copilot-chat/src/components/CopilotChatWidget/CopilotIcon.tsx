import copilotLogo from '../../assets/copilot-logo.png';

type CopilotIconProps = {
  className?: string;
};

export const CopilotIcon = ({ className }: CopilotIconProps) => (
  <img src={copilotLogo} alt="Copilot" className={className} />
);
