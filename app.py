import streamlit as st
import pandas as pd
import altair as alt

st.set_page_config(layout="wide", page_title="Vendas Asfalto", page_icon="https://img.icons8.com/deco-color/48/road.png")

def format_kg(valor):
    if pd.isna(valor): return "-"
    return f"{valor:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".") + " Kg"

@st.cache_data
def load_data():
    tipos = {
        'ANO': 'int16', 'REGIAO': 'category', 'UF': 'category',
        'IBGE': 'int32', 'MUNICIPIO': 'category',
        'VENDAS_CORRECAO': 'float64'
    }
    df = pd.read_csv('arquivo.csv', sep=';', dtype=tipos)
    
    fato = df[['ANO', 'IBGE', 'VENDAS_CORRECAO']]
    dim_localidade = df[['IBGE', 'MUNICIPIO', 'UF', 'REGIAO']].drop_duplicates()
    dim_tempo = df[['ANO']].drop_duplicates().sort_values('ANO')
    
    return fato, dim_localidade, dim_tempo

fato, dim_localidade, dim_tempo = load_data()

st.sidebar.title("1992–2024")
pagina = st.sidebar.radio("Navegação", [
    "Visão Geral Brasil", 
    "Recorte Geográfico (UF)", 
    "Série Temporal/Insights",
    "Participação Regional"
])

st.sidebar.divider()
st.sidebar.subheader("Filtros")
f_ano = st.sidebar.multiselect("ANO", options=dim_tempo['ANO'].unique())
f_regiao = st.sidebar.multiselect("REGIÃO", options=dim_localidade['REGIAO'].unique().categories)
f_uf = st.sidebar.multiselect("UF", options=dim_localidade['UF'].unique().categories)

df_view = fato.merge(dim_localidade, on='IBGE')
total_absoluto_arquivo = fato['VENDAS_CORRECAO'].sum()

if f_ano:
    df_view = df_view[df_view['ANO'].isin(f_ano)]
if f_regiao:
    df_view = df_view[df_view['REGIAO'].isin(f_regiao)]
if f_uf:
    df_view = df_view[df_view['UF'].isin(f_uf)]

total_vendas_filtrado = df_view['VENDAS_CORRECAO'].sum()
share_nacional = (total_vendas_filtrado / total_absoluto_arquivo) * 100
media_vendas = df_view['VENDAS_CORRECAO'].mean()

vendas_ano = df_view.groupby('ANO')['VENDAS_CORRECAO'].sum().reset_index()
vendas_ano['ANO'] = vendas_ano['ANO'].astype(int)

yoy = vendas_ano.copy()
yoy['CRESCIMENTO'] = yoy['VENDAS_CORRECAO'].pct_change() * 100

vendas_full_time = fato.groupby('ANO')['VENDAS_CORRECAO'].sum().reset_index()
vendas_full_time['MEDIA_MOVEL'] = vendas_full_time['VENDAS_CORRECAO'].rolling(window=3).mean()

if pagina == "Visão Geral Brasil":
    st.header("Visão Geral Brasil")
    st.metric("Total Massa Vendida", format_kg(total_vendas_filtrado))
    col1, col2 = st.columns(2)
    col1.metric("Participação sobre o Histórico Total", f"{share_nacional:.2f}%".replace(".", ","))
    col2.metric("Média por Registro", format_kg(media_vendas))
    st.subheader("Massa por Região")
    chart_reg = alt.Chart(df_view).mark_bar().encode(
        x=alt.X('REGIAO:N', title='Região'),
        y=alt.Y('sum(VENDAS_CORRECAO):Q', title='Total (Kg)', axis=alt.Axis(format=',.2f')),
        tooltip=[alt.Tooltip('REGIAO'), alt.Tooltip('sum(VENDAS_CORRECAO)', format=',.2f', title='Total Kg')]
    ).properties(height=400)
    st.altair_chart(chart_reg, use_container_width=True)

elif pagina == "Recorte Geográfico (UF)":
    st.header("Recorte Geográfico (UF)")
    st.subheader("Ranking de Massa por Estado")
    ranking_uf = df_view.groupby('UF', observed=True)['VENDAS_CORRECAO'].sum().reset_index().sort_values('VENDAS_CORRECAO', ascending=False)
    chart_uf = alt.Chart(ranking_uf).mark_bar().encode(
        x=alt.X('VENDAS_CORRECAO:Q', title='Total (Kg)', axis=alt.Axis(format=',.2f')),
        y=alt.Y('UF:N', sort='-x', title='Estado'),
        color=alt.Color('VENDAS_CORRECAO:Q', scale=alt.Scale(scheme='blues'), legend=None)
    ).properties(height=600)
    st.altair_chart(chart_uf, use_container_width=True)
    st.subheader("Detalhamento por UF")
    df_table = ranking_uf.copy()
    df_table['VENDAS_CORRECAO'] = df_table['VENDAS_CORRECAO'].apply(format_kg)
    st.dataframe(df_table.rename(columns={'VENDAS_CORRECAO': 'Massa Total'}), hide_index=True, use_container_width=True, height=(len(df_table) + 1) * 35 + 3)

elif pagina == "Série Temporal/Insights":
    st.header("Série Temporal e Insights")
    st.subheader("Evolução Anual de Massa (Kg)")
    chart_time = alt.Chart(vendas_ano).mark_line(point=True).encode(
        x=alt.X('ANO:O', title='Ano'),
        y=alt.Y('VENDAS_CORRECAO:Q', title='Massa (Kg)', axis=alt.Axis(format=',.2f')),
        tooltip=['ANO', alt.Tooltip('VENDAS_CORRECAO', format=',.2f', title='Kg')]
    ).properties(height=400)
    st.altair_chart(chart_time, use_container_width=True)
    st.subheader("Média Móvel (Últimos 3 Anos)")
    df_mm = vendas_full_time.copy()
    if f_ano:
        df_mm = df_mm[df_mm['ANO'].isin(f_ano)]
    chart_mm = alt.Chart(df_mm).mark_line(color='orange', point=True).encode(
        x=alt.X('ANO:O', title='Ano'),
        y=alt.Y('MEDIA_MOVEL:Q', title='Média Móvel (Kg)', axis=alt.Axis(format=',.2f')),
        tooltip=['ANO', alt.Tooltip('MEDIA_MOVEL', format=',.2f', title='Kg')]
    ).properties(height=400)
    st.altair_chart(chart_mm, use_container_width=True)
    st.subheader("Crescimento Ano a Ano (%)")
    chart_yoy = alt.Chart(yoy).mark_area(opacity=0.5).encode(
        x=alt.X('ANO:O', title='Ano'),
        y=alt.Y('CRESCIMENTO:Q', title='Crescimento (%)'),
        tooltip=['ANO', alt.Tooltip('CRESCIMENTO', format='.2f')]
    ).properties(height=300)
    st.altair_chart(chart_yoy, use_container_width=True)

elif pagina == "Participação Regional":
    st.header("Evolução da Participação Regional")
    df_reg_total = fato.merge(dim_localidade[['IBGE', 'REGIAO']], on='IBGE')
    df_reg_total = df_reg_total.groupby(['ANO', 'REGIAO'], observed=True)['VENDAS_CORRECAO'].sum().reset_index()
    df_reg_total['TOTAL_ANO'] = df_reg_total.groupby('ANO')['VENDAS_CORRECAO'].transform('sum')
    df_reg_total['PERCENTUAL'] = df_reg_total['VENDAS_CORRECAO'] / df_reg_total['TOTAL_ANO']

    chart_area = alt.Chart(df_reg_total).mark_area().encode(
        x=alt.X('ANO:O', title='Ano'),
        y=alt.Y('PERCENTUAL:Q', stack='normalize', title='Participação (%)', axis=alt.Axis(format='.0%')),
        color=alt.Color('REGIAO:N', title='Região'),
        tooltip=['ANO', 'REGIAO', alt.Tooltip('PERCENTUAL', format='.2%')]
    ).properties(height=600)
    st.altair_chart(chart_area, use_container_width=True)