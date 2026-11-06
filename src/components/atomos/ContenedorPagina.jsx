import styled from "styled-components";

export const ContenedorPagina = styled.div`
  width: 100%;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 18px;
  color: ${({ theme }) => theme.text};

  .cabecera {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    min-width: 0;
  }

  .titulo {
    display: flex;
    flex-direction: column;
    gap: 4px;

    h1 {
      font-size: 1.6em;
    }
    p {
      color: ${({ theme }) => theme.colorSubtitle};
    }
  }

  .barra {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .acciones {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px;
  }

  .tarjetas {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
    gap: 12px;
  }

  .panel {
    min-width: 0;
    padding: 16px;
    border-radius: 16px;
    border: 1px solid ${({ theme }) => theme.bg4};
    background: ${({ theme }) => theme.bg2};

    h2 {
      font-size: 1.05em;
      margin-bottom: 12px;
    }
  }

  .vacio {
    padding: 32px 16px;
    text-align: center;
    color: ${({ theme }) => theme.colorSubtitle};
  }

  .error {
    padding: 14px 16px;
    border-radius: 12px;
    border: 1px solid #f54e41;
    color: #f54e41;
  }
`;
